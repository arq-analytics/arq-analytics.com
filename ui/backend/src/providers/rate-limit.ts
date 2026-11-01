export interface RateLimiter {
  /** Returns true when the request is allowed. */
  allow(key: string, now: number): boolean;
}

/**
 * Best effort in-memory limiter. Serverless instances do not share memory,
 * so this only slows trivial abuse. Replace behind the interface when needed.
 */
export class MemoryRateLimiter implements RateLimiter {
  private hits = new Map<string, number[]>();

  constructor(
    private limit = 5,
    private windowMs = 60 * 60 * 1000,
  ) {}

  allow(key: string, now: number): boolean {
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    return true;
  }
}
