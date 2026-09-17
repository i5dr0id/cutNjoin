import "server-only";

const MAX_TRACKED_CLIENTS = 5000;

export function createRateLimiter({ windowMs, max }: { windowMs: number; max: number }) {
  const requestLog = new Map<string, number[]>();

  return function isRateLimited(clientId: string, now = Date.now()): boolean {
    const recent = (requestLog.get(clientId) ?? []).filter((time) => now - time < windowMs);
    if (recent.length >= max) {
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
  };
}

export const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });

export function clientIdFrom(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}
