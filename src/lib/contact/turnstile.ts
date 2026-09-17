import "server-only";
import { serverEnv } from "@/lib/env";
import { siteConfig } from "@/lib/site";
import { TURNSTILE_ACTION } from "./turnstileAction";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const VERIFY_TIMEOUT_MS = 10_000;

export type TurnstileResult = "ok" | "failed" | "not_configured";

type SiteverifyResponse = {
  success?: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
  metadata?: { result_with_testing_key?: boolean };
};

function allowedHostnames() {
  const configured = serverEnv.turnstileHostnames();
  if (configured)
    return configured
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean);
  const hostnames = [new URL(siteConfig.url).hostname.toLowerCase()];
  if (process.env.NODE_ENV === "development") hostnames.push("localhost", "127.0.0.1");
  return hostnames;
}

export async function verifyTurnstile(
  token: string | undefined,
  ip: string | null,
): Promise<TurnstileResult> {
  const secret = serverEnv.turnstileSecretKey();
  if (!secret) return "not_configured";
  if (!token) return "failed";

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  let result: SiteverifyResponse;
  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    });
    result = (await response.json()) as SiteverifyResponse;
  } catch (error) {
    console.error("[contact] turnstile verification failed", error);
    return "failed";
  }

  if (!result.success) {
    console.warn("[contact] turnstile rejected", result["error-codes"]);
    return "failed";
  }
  if (result.action && result.action !== TURNSTILE_ACTION) {
    console.warn("[contact] turnstile action mismatch", result.action);
    return "failed";
  }
  const testingKey = result.metadata?.result_with_testing_key === true;
  if (!testingKey && result.hostname && !allowedHostnames().includes(result.hostname.toLowerCase())) {
    console.warn("[contact] turnstile hostname mismatch", result.hostname);
    return "failed";
  }
  return "ok";
}
