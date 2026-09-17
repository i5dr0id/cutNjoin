import { Resend } from "resend";
import { z } from "zod";
import { briefEmail } from "@/lib/contact/email";
import { clientIdFrom, isRateLimited } from "@/lib/rateLimit";
import { serverEnv } from "@/lib/env";
import { contactSchema } from "@/lib/validation/contact";

const MAX_BODY_BYTES = 16 * 1024;
const MIN_FILL_TIME_MS = 3000;

const json = (body: object, status = 200) => Response.json(body, { status });

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  return new URL(origin).host === host;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ ok: false, error: "forbidden" }, 403);

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return json({ ok: false, error: "too_large" }, 413);

  if (isRateLimited(clientIdFrom(request))) return json({ ok: false, error: "rate_limited" }, 429);

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "too_large" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "invalid" }, 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, error: "invalid", fields: z.flattenError(parsed.error).fieldErrors }, 400);
  }

  const { company: honeypot, startedAt, ...brief } = parsed.data;
  const filledTooFast = startedAt !== undefined && Date.now() - startedAt < MIN_FILL_TIME_MS;
  if (honeypot || filledTooFast) return json({ ok: true });

  const apiKey = serverEnv.resendApiKey();
  const to = serverEnv.contactTo();
  if (!apiKey || !to) {
    console.error("[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set");
    return json({ ok: false, error: "unavailable" }, 503);
  }

  const { subject, text, html } = briefEmail(brief);
  const { error } = await new Resend(apiKey).emails.send({
    from: serverEnv.contactFrom(),
    to,
    replyTo: brief.email,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("[contact] Resend error", error.name, error.message);
    return json({ ok: false, error: "delivery_failed" }, 502);
  }
  return json({ ok: true });
}
