import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink, Container } from "@/components/primitives";
import { ClearCart } from "@/components/store/ClearCart";
import { formatNaira } from "@/lib/format";
import { routes } from "@/lib/site";
import { isOrderReference, settleOrder, type SettleResult } from "@/lib/store/orders";
import { verifyTransaction } from "@/lib/store/paystack";

export const metadata: Metadata = { title: "Order status", robots: { index: false, follow: false } };

const single = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

async function checkOrder(reference: string): Promise<SettleResult> {
  try {
    return await settleOrder(reference, await verifyTransaction(reference));
  } catch (error) {
    console.error("[store] complete", reference, error);
    return { state: "pending" };
  }
}

export default async function CheckoutCompletePage({ searchParams }: PageProps<"/store/checkout/complete">) {
  const params = await searchParams;
  const reference = single(params.reference) || single(params.trxref);
  const result: SettleResult = isOrderReference(reference)
    ? await checkOrder(reference)
    : { state: "not_found" };
  const paid = ["paid", "shipped", "delivered"].includes(result.state);
  const failed = ["failed", "cancelled", "refunded"].includes(result.state);
  const order = result.order;

  return (
    <Container className="pt-40 pb-24">
      <div className="flex max-w-[720px] flex-col gap-8">
        {paid ? (
          <>
            <ClearCart />
            <CheckCircle2 aria-hidden className="size-10 text-accent" />
            <h1 className="text-heading font-bold uppercase">Thank you</h1>
            <p className="text-lg leading-[28.67px] text-fg/66">
              Your order <strong className="font-mono text-fg">{reference}</strong> is confirmed. A receipt is
              on its way to your inbox, and we&apos;ll email you again when it ships.
            </p>
          </>
        ) : failed ? (
          <>
            <XCircle aria-hidden className="size-10 text-fg/60" />
            <h1 className="text-heading font-bold uppercase">Payment not completed</h1>
            <p className="text-lg leading-[28.67px] text-fg/66">
              We couldn&apos;t confirm payment for order{" "}
              <strong className="font-mono text-fg">{reference}</strong>. Your cart is still saved — you can
              try again. If you were charged, contact us with this reference.
            </p>
          </>
        ) : result.state === "not_found" ? (
          <>
            <h1 className="text-heading font-bold uppercase">Order not found</h1>
            <p className="text-lg leading-[28.67px] text-fg/66">
              We couldn&apos;t find that order. If you completed a payment, contact us and we&apos;ll sort it
              out.
            </p>
          </>
        ) : (
          <>
            <Clock aria-hidden className="size-10 text-fg/60" />
            <h1 className="text-heading font-bold uppercase">Confirming payment</h1>
            <p className="text-lg leading-[28.67px] text-fg/66">
              We haven&apos;t received confirmation for order{" "}
              <strong className="font-mono text-fg">{reference}</strong> yet. This usually takes a few
              seconds. If you left the payment page before finishing, your cart is still saved.
            </p>
          </>
        )}

        {order && (
          <dl className="flex flex-col gap-2 border border-fg/7 bg-well p-6 text-sm">
            {order.items.map((item) => (
              <div key={item._key} className="flex justify-between gap-4">
                <dt className="text-fg/80">
                  {item.name} · {item.size} × {item.quantity}
                </dt>
                <dd className="font-mono">{formatNaira(item.unitPrice * item.quantity)}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 border-t border-line pt-3">
              <dt className="text-fg/66">Delivery</dt>
              <dd className="font-mono">{formatNaira(order.shippingFee)}</dd>
            </div>
            <div className="flex justify-between gap-4 font-semibold">
              <dt>Total</dt>
              <dd className="font-mono">{formatNaira(order.total)}</dd>
            </div>
          </dl>
        )}

        <div className="flex flex-wrap gap-4">
          {paid ? (
            <ButtonLink href={routes.store} variant="outline">
              Continue shopping
            </ButtonLink>
          ) : failed ? (
            <ButtonLink href={routes.checkout}>Try again</ButtonLink>
          ) : result.state === "not_found" ? (
            <ButtonLink href={routes.store} variant="outline">
              Back to the store
            </ButtonLink>
          ) : (
            <>
              <ButtonLink href={`${routes.checkoutComplete}?reference=${reference}`}>Check again</ButtonLink>
              <ButtonLink href={routes.checkout} variant="outline">
                Back to checkout
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
