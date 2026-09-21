import "server-only";
import { getServerEnv } from "@/config/env";
import { safeRedis } from "@/lib/redis";

/**
 * Fixed-window rate limiter on Redis (INCR + EXPIRE).
 * Fails open: if Redis is unavailable the request is allowed.
 */

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
}

export interface RateLimitOptions {
  /** Identifies the bucket, e.g. `${ip}:${routeGroup}`. */
  key: string;
  limit: number;
  windowSeconds?: number;
}

export async function rateLimit({ key, limit, windowSeconds = 60 }: RateLimitOptions): Promise<RateLimitResult> {
  const redisKey = `${getServerEnv().REDIS_KEY_PREFIX}:rl:${key}`;

  const result = await safeRedis(async (r) => {
    const pipe = r.pipeline();
    pipe.incr(redisKey);
    pipe.ttl(redisKey);
    const replies = await pipe.exec();
    const count = Number(replies?.[0]?.[1] ?? 0);
    let ttl = Number(replies?.[1]?.[1] ?? -1);
    if (ttl < 0) {
      await r.expire(redisKey, windowSeconds);
      ttl = windowSeconds;
    }
    return { count, ttl };
  }, null);

  if (!result) {
    return { allowed: true, limit, remaining: limit, retryAfter: 0 };
  }

  const remaining = Math.max(0, limit - result.count);
  return {
    allowed: result.count <= limit,
    limit,
    remaining,
    retryAfter: result.count <= limit ? 0 : result.ttl,
  };
}

/** Best-effort client IP from proxy headers. */
export function clientIpFromHeaders(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  return headers.get("x-real-ip") ?? headers.get("cf-connecting-ip") ?? "unknown";
}
