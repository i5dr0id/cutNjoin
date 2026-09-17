import "server-only";
import { Resend } from "resend";
import { formatNaira } from "@/lib/format";
import { escapeHtml } from "@/lib/html";
import { serverEnv } from "@/lib/env";
import type { OrderDocument } from "./orders";

function orderTable(order: OrderDocument) {
  const rows = order.items
    .map(
      (item) =>
        `<tr><td style="padding:6px 0">${item.quantity} × ${escapeHtml(item.name)} — ${escapeHtml(item.size)}</td><td style="padding:6px 0;text-align:right">${formatNaira(item.unitPrice * item.quantity)}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" style="border-collapse:collapse;font-size:14px">
    ${rows}
    <tr><td style="padding:6px 0;border-top:1px solid #2a2a2a;color:#8a8a8a">Subtotal</td><td style="padding:6px 0;border-top:1px solid #2a2a2a;text-align:right">${formatNaira(order.subtotal)}</td></tr>
    <tr><td style="padding:6px 0;color:#8a8a8a">Delivery (${escapeHtml(order.shipping.zone)})</td><td style="padding:6px 0;text-align:right">${formatNaira(order.shippingFee)}</td></tr>
    <tr><td style="padding:6px 0;font-weight:bold">Total</td><td style="padding:6px 0;text-align:right;font-weight:bold">${formatNaira(order.total)}</td></tr>
  </table>`;
}

function orderText(order: OrderDocument) {
  return [
    ...order.items.map(
      (item) =>
        `${item.quantity} × ${item.name} (${item.size}) — ${formatNaira(item.unitPrice * item.quantity)}`,
    ),
    `Subtotal: ${formatNaira(order.subtotal)}`,
    `Delivery (${order.shipping.zone}): ${formatNaira(order.shippingFee)}`,
    `Total: ${formatNaira(order.total)}`,
  ].join("\n");
}

const address = (order: OrderDocument) =>
  [
    order.shipping.address,
    order.shipping.city,
    order.shipping.state,
    order.shipping.postcode,
    order.shipping.country,
  ]
    .filter(Boolean)
    .join(", ");

const wrap = (heading: string, body: string) => `<!doctype html>
<html><body style="margin:0;padding:24px;background:#0d0d0d;font-family:Arial,Helvetica,sans-serif;color:#f2f2f2">
  <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#161616;border:1px solid #2a2a2a">
    <tr><td style="padding:24px 24px 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#3ddc4f">CUT&amp;JOIN Studios</td></tr>
    <tr><td style="padding:0 24px 16px;font-size:22px;font-weight:bold">${heading}</td></tr>
    <tr><td style="padding:0 24px 24px;font-size:14px;line-height:1.6">${body}</td></tr>
  </table>
</body></html>`;

export async function sendOrderEmails(order: OrderDocument, notifyTo: string | null) {
  const apiKey = serverEnv.resendApiKey();
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  const resend = new Resend(apiKey);
  const from = serverEnv.contactFrom();
  const studioInbox = notifyTo || serverEnv.contactTo();
  const eta = order.shipping.eta ? `<p>Estimated delivery: ${escapeHtml(order.shipping.eta)}.</p>` : "";

  const customer = resend.emails.send({
    from,
    to: order.customer.email,
    replyTo: studioInbox ?? undefined,
    subject: `Your CUT&JOIN order ${order.reference}`,
    html: wrap(
      "Thank you for your order",
      `<p>Hi ${escapeHtml(order.customer.name)}, we've received your payment for order <strong>${order.reference}</strong>.</p>
       ${orderTable(order)}
       <p style="margin-top:16px">Delivering to: ${escapeHtml(address(order))}</p>${eta}
       <p>We'll email you again when it ships.</p>`,
    ),
    text: `Thank you for your order ${order.reference}.\n\n${orderText(order)}\n\nDelivering to: ${address(order)}`,
  });

  const studio = studioInbox
    ? resend.emails.send({
        from,
        to: studioInbox,
        replyTo: order.customer.email,
        subject: `New order ${order.reference} — ${formatNaira(order.total)}`,
        html: wrap(
          `New order ${order.reference}`,
          `<p><strong>${escapeHtml(order.customer.name)}</strong> · ${escapeHtml(order.customer.email)} · ${escapeHtml(order.customer.phone)}</p>
           ${orderTable(order)}
           <p style="margin-top:16px">Deliver to: ${escapeHtml(address(order))}</p>`,
        ),
        text: `New order ${order.reference}\n${order.customer.name} · ${order.customer.email} · ${order.customer.phone}\n\n${orderText(order)}\n\nDeliver to: ${address(order)}`,
      })
    : Promise.resolve({ error: null });

  const results = await Promise.all([customer, studio]);
  const failed = results.find((result) => result.error);
  if (failed?.error) throw new Error(`${failed.error.name}: ${failed.error.message}`);
}
