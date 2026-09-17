import { clientIdFrom, createRateLimiter } from "@/lib/rateLimit";
import { routes } from "@/lib/site";
import { checkoutRequestSchema } from "@/lib/store/checkoutSchema";
import { createPendingOrder, createReference } from "@/lib/store/orders";
import { initializeTransaction } from "@/lib/store/paystack";
import { priceCheckout } from "@/lib/store/pricing";

const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 10 });

const json = (body: object, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;
  const forwardedHost = request.headers.get("x-forwarded-host");
  const siteOrigin = forwardedHost ? `${new URL(request.url).protocol}//${forwardedHost}` : requestOrigin;
  if (origin && origin !== siteOrigin) return json({ ok: false, error: "forbidden" }, 403);

  if (isRateLimited(clientIdFrom(request))) return json({ ok: false, error: "rate_limited" }, 429);

  const parsed = checkoutRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const fields: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field =
        issue.path[0] === "details" ? String(issue.path[1] ?? "details") : String(issue.path[0] ?? "request");
      (fields[field] ??= []).push(issue.message);
    }
    return json({ ok: false, error: "invalid", fields }, 400);
  }

  const { items, details } = parsed.data;
  const pricing = await priceCheckout(items, details);
  if (!pricing.ok) return json({ ok: false, error: pricing.error, problems: pricing.problems }, 409);

  const reference = createReference();
  try {
    await createPendingOrder({ reference, details, ...pricing });
    const payment = await initializeTransaction({
      email: details.email,
      amountNaira: pricing.total,
      reference,
      callbackUrl: `${siteOrigin}${routes.checkoutComplete}`,
      metadata: {
        order_reference: reference,
        custom_fields: [
          { display_name: "Order", variable_name: "order_reference", value: reference },
          { display_name: "Customer", variable_name: "customer_name", value: details.name },
        ],
      },
    });
    return json({ ok: true, reference, authorizationUrl: payment.authorization_url });
  } catch (error) {
    console.error("[store] checkout", reference, error);
    return json({ ok: false, error: "payment_unavailable" }, 502);
  }
}
