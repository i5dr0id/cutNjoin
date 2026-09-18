import "server-only";
import { Resend } from "resend";
import { serverEnv } from "@/lib/env";

export type SubscribeResult = "subscribed" | "unavailable" | "failed";

export async function subscribeToNewsletter(email: string): Promise<SubscribeResult> {
  const apiKey = serverEnv.resendApiKey();
  const audienceId = serverEnv.newsletterAudienceId();
  if (!apiKey || !audienceId) {
    console.error("[newsletter] RESEND_API_KEY or RESEND_AUDIENCE_ID is not set");
    return "unavailable";
  }

  const { error } = await new Resend(apiKey).contacts.create({
    email,
    audienceId,
    unsubscribed: false,
  });

  if (!error) return "subscribed";
  if (/already exists/i.test(error.message)) return "subscribed";
  console.error("[newsletter] subscribe", error);
  return "failed";
}
