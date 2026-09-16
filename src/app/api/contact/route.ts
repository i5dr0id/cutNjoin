import { Resend } from "resend";
import { z } from "zod";
import { serverEnv } from "@/lib/env";
import { contactSchema } from "@/lib/validation/contact";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, errors: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
  }

  const { company: honeypot, ...data } = parsed.data;
  const isSpamBot = Boolean(honeypot);
  if (isSpamBot) return Response.json({ ok: true });

  const apiKey = serverEnv.resendApiKey();
  const to = serverEnv.contactTo();
  if (!apiKey || !to) {
    console.error("[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set");
    return Response.json({ ok: false }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: serverEnv.contactFrom(),
    to,
    replyTo: data.email,
    subject: `New brief: ${data.projectType} — ${data.fullName}`,
    text: [
      `Name: ${data.fullName}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      `Project type: ${data.projectType}`,
      "",
      data.description,
    ].join("\n"),
  });

  if (error) {
    console.error("[contact] Resend error", error);
    return Response.json({ ok: false }, { status: 502 });
  }
  return Response.json({ ok: true });
}
