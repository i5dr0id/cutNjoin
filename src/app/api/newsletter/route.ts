import { subscribeToNewsletter } from "@/lib/contact/newsletter";
import { clientIdFrom, createRateLimiter } from "@/lib/rateLimit";
import { newsletterSchema } from "@/lib/validation/newsletter";

const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });
const MAX_BODY_BYTES = 2 * 1024;

const json = (body: object, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && new URL(origin).host !== host) return json({ ok: false, error: "forbidden" }, 403);

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "too_large" }, 413);
  if (isRateLimited(clientIdFrom(request))) return json({ ok: false, error: "rate_limited" }, 429);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "invalid" }, 400);
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, error: "invalid" }, 400);
  if (parsed.data.company) return json({ ok: true });

  const result = await subscribeToNewsletter(parsed.data.email);
  if (result === "subscribed") return json({ ok: true });
  return json({ ok: false, error: result }, result === "unavailable" ? 503 : 502);
}
