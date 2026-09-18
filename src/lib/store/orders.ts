import "server-only";
import { randomBytes } from "node:crypto";
import { freshClient, writeClient } from "@/sanity/writeClient";
import type { CheckoutDetails } from "./checkoutSchema";
import { sendOrderEmails } from "./emails";
import { toKobo, type PaystackTransaction } from "./paystack";
import type { PricedLine } from "./pricing";
import { countryName } from "./regions";
import type { ShippingQuote } from "./shipping";

const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const FAILED_STATUSES = new Set(["failed", "reversed"]);

export type OrderStatus = "pending" | "paid" | "failed" | "shipped" | "delivered" | "cancelled" | "refunded";

export type OrderDocument = {
  _id: string;
  _rev: string;
  reference: string;
  status: OrderStatus;
  placedAt: string;
  paidAt?: string;
  customer: { name: string; email: string; phone: string };
  shipping: {
    country: string;
    state: string;
    city: string;
    address: string;
    postcode?: string;
    zone: string;
    eta?: string;
  };
  items: {
    _key: string;
    product: { _ref: string };
    variantKey: string;
    name: string;
    size: string;
    quantity: number;
    unitPrice: number;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  emailsSent?: boolean;
};

export const isOrderReference = (value: string) => /^CJ\d{6}-[A-Z0-9]{6}$/.test(value);

export const orderDocumentId = (reference: string) => `orders.${reference}`;

export function createReference(now = new Date()) {
  const date = now.toISOString().slice(2, 10).replaceAll("-", "");
  const bytes = randomBytes(6);
  const suffix = Array.from(bytes, (byte) => REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length]).join("");
  return `CJ${date}-${suffix}`;
}

export async function createPendingOrder(input: {
  reference: string;
  details: CheckoutDetails;
  lines: PricedLine[];
  subtotal: number;
  shipping: ShippingQuote;
  total: number;
}) {
  const { reference, details, lines, subtotal, shipping, total } = input;
  await writeClient().create({
    _id: orderDocumentId(reference),
    _type: "order",
    reference,
    status: "pending",
    placedAt: new Date().toISOString(),
    customer: { name: details.name, email: details.email, phone: details.phone },
    shipping: {
      country: countryName(details.country),
      state: details.state,
      city: details.city,
      address: details.address,
      postcode: details.postcode || undefined,
      zone: shipping.zone,
      eta: shipping.eta ?? undefined,
    },
    items: lines.map((line, index) => ({
      _key: `item${index}`,
      _type: "orderItem",
      product: { _type: "reference", _ref: line.productId, _weak: true },
      variantKey: line.variantKey,
      name: line.name,
      size: line.size,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
    })),
    subtotal,
    shippingFee: shipping.fee,
    total,
    stockAdjusted: false,
    emailsSent: false,
  });
}

export type SettleResult = { state: OrderStatus | "not_found"; order?: OrderDocument };

function isRevisionConflict(error: unknown) {
  return typeof error === "object" && error !== null && "statusCode" in error && error.statusCode === 409;
}

export async function settleOrder(
  reference: string,
  transaction: PaystackTransaction,
): Promise<SettleResult> {
  const client = writeClient();
  const id = orderDocumentId(reference);

  for (let attempt = 0; attempt < 3; attempt++) {
    const order = await client.getDocument<OrderDocument>(id);
    if (!order) return { state: "not_found" };
    const settleable =
      order.status === "pending" || (order.status === "failed" && transaction.status === "success");
    if (!settleable) return { state: order.status, order };

    if (transaction.status !== "success") {
      if (!FAILED_STATUSES.has(transaction.status)) return { state: "pending", order };
      await client
        .patch(id)
        .ifRevisionId(order._rev)
        .set({ status: "failed" })
        .commit()
        .catch(() => undefined);
      return { state: "failed", order };
    }

    const amountMatches = transaction.amount === toKobo(order.total) && transaction.currency === "NGN";
    if (!amountMatches) {
      await client
        .patch(id)
        .set({
          status: "failed",
          notes: `Payment ${transaction.reference} was ${transaction.currency} ${transaction.amount / 100}, expected NGN ${order.total}.`,
        })
        .commit();
      return { state: "failed", order };
    }

    const settle = client.transaction().patch(id, (patch) =>
      patch.ifRevisionId(order._rev).set({
        status: "paid",
        paidAt: transaction.paid_at ?? new Date().toISOString(),
        stockAdjusted: true,
        payment: {
          provider: "Paystack",
          transactionId: String(transaction.id),
          channel: transaction.channel,
          amountPaid: transaction.amount / 100,
        },
      }),
    );
    for (const item of order.items) {
      settle.patch(item.product._ref, (patch) =>
        patch
          .setIfMissing({ unitsSold: 0 })
          .dec({ [`variants[_key=="${item.variantKey}"].stock`]: item.quantity })
          .inc({ unitsSold: item.quantity }),
      );
    }

    try {
      await settle.commit();
    } catch (error) {
      if (isRevisionConflict(error)) continue;
      throw error;
    }

    const paid = (await client.getDocument<OrderDocument>(id)) ?? order;
    const notifyTo = await freshClient.fetch<string | null>(
      `*[_id == "storeSettings"][0].orderEmail`,
      {},
      { cache: "no-store" },
    );
    try {
      await sendOrderEmails(paid, notifyTo);
      await client.patch(id).set({ emailsSent: true }).commit();
    } catch (error) {
      console.error("[store] order emails", reference, error);
    }
    return { state: "paid", order: paid };
  }

  const latest = await client.getDocument<OrderDocument>(id);
  return { state: latest?.status ?? "not_found", order: latest ?? undefined };
}
