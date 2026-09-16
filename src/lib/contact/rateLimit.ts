import "server-only";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const MAX_TRACKED_CLIENTS = 5000;

const requestLog = new Map<string, number[]>();

export function isRateLimited(clientId: string, now = Date.now()): boolean {
  const recent = (requestLog.get(clientId) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(clientId, recent);
    return true;
  }
  recent.push(now);
  requestLog.set(clientId, recent);
  if (requestLog.size > MAX_TRACKED_CLIENTS) {
    const oldest = requestLog.keys().next().value;
    if (oldest !== undefined) requestLog.delete(oldest);
  }
  return false;
}

export function clientIdFrom(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}
