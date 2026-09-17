import { isOrderReference, settleOrder } from "@/lib/store/orders";
import { isValidWebhookSignature, verifyTransaction } from "@/lib/store/paystack";

type PaystackEvent = { event: string; data?: { reference?: string } };

const SETTLING_EVENTS = new Set(["charge.success", "charge.failed"]);

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!isValidWebhookSignature(rawBody, request.headers.get("x-paystack-signature"))) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(rawBody) as PaystackEvent;
  const reference = event.data?.reference;
  if (!SETTLING_EVENTS.has(event.event) || !reference || !isOrderReference(reference)) {
    return new Response("Ignored", { status: 200 });
  }

  try {
    const transaction = await verifyTransaction(reference);
    const result = await settleOrder(reference, transaction);
    return Response.json({ received: true, state: result.state });
  } catch (error) {
    console.error("[store] webhook", reference, error);
    return new Response("Processing failed", { status: 500 });
  }
}
