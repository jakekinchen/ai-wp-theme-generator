const buckets = new Map<string, number[]>();

export type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
  now?: () => number;
};

export function checkRateLimit(key: string, options: RateLimitOptions): { allowed: boolean; retryAfterMs: number } {
  const now = (options.now ?? Date.now)();
  const cutoff = now - options.windowMs;
  const history = (buckets.get(key) ?? []).filter((timestamp) => timestamp > cutoff);
  if (history.length >= options.maxRequests) {
    const retryAfterMs = options.windowMs - (now - history[0]);
    buckets.set(key, history);
    return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 0) };
  }
  history.push(now);
  buckets.set(key, history);
  return { allowed: true, retryAfterMs: 0 };
}

export function resetRateLimit(): void {
  buckets.clear();
}
