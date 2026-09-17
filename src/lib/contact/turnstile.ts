import "server-only";
import { serverEnv } from "@/lib/env";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult = "ok" | "failed" | "not_configured";

export async function verifyTurnstile(
  token: string | undefined,
  ip: string | null,
): Promise<TurnstileResult> {
  const secret = serverEnv.turnstileSecretKey();
  if (!secret) return "not_configured";
  if (!token) return "failed";

  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);

  try {
    const response = await fetch(VERIFY_URL, { method: "POST", body });
    const result = (await response.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!result.success) console.warn("[contact] turnstile rejected", result["error-codes"]);
    return result.success ? "ok" : "failed";
  } catch (error) {
    console.error("[contact] turnstile verification failed", error);
    return "failed";
  }
}
