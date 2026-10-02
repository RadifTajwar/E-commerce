import "server-only";
import { getServerEnv } from "@/config/env";
import { logger } from "@/lib/logger";
import { safeRedis } from "@/lib/redis";

/**
 * Cache-aside helper on Redis.
 *
 *   const data = await withCache("products:list:" + hash, ttl, () => backend.get(...), { namespace: "products" });
 *
 * Keys are prefixed with REDIS_KEY_PREFIX. Each key is also recorded in a
 * per-namespace set so `invalidateNamespace("products")` can drop every
 * product-related entry after a write without KEYS/SCAN.
 *
 * If Redis is down, the fetcher is called directly and a warning is logged.
 */

export interface CacheOptions {
  namespace?: string;
  /** Skip the cache for this call (e.g. `?fresh=1` in dev). */
  bypass?: boolean;
}

const prefix = () => getServerEnv().REDIS_KEY_PREFIX;
const fullKey = (key: string) => `${prefix()}:${key}`;
const nsKey = (ns: string) => `${prefix()}:ns:${ns}`;

/** Deterministic key fragment from an object (query params etc.). */
export function hashKey(input: unknown): string {
  const json = stableStringify(input);
  // FNV-1a 32-bit, good enough for cache keys; collisions only cost a cache miss.
  let h = 0x811c9dc5;
  for (let i = 0; i < json.length; i++) {
    h ^= json.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "undefined";
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj)
    .filter((k) => obj[k] !== undefined)
    .sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(",")}}`;
}

export async function cacheGet<T>(key: string): Promise<T | undefined> {
  const raw = await safeRedis((r) => r.get(fullKey(key)), null);
  if (raw === null || raw === undefined) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number, namespace?: string): Promise<void> {
  if (value === undefined) return;
  const payload = JSON.stringify(value);
  await safeRedis(async (r) => {
    const pipe = r.pipeline();
    pipe.set(fullKey(key), payload, "EX", ttlSeconds);
    if (namespace) {
      pipe.sadd(nsKey(namespace), fullKey(key));
      // Keep the index alive a little longer than the longest entry it tracks.
      pipe.expire(nsKey(namespace), Math.max(ttlSeconds * 2, 3600));
    }
    await pipe.exec();
  }, undefined);
}

export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
  options: CacheOptions = {},
): Promise<T> {
  if (options.bypass || ttlSeconds <= 0) return fetcher();

  const hit = await cacheGet<T>(key);
  if (hit !== undefined) {
    logger.debug({ key }, "cache hit");
    return hit;
  }

  const value = await fetcher();
  // Fire-and-forget; a failed write must not fail the request.
  void cacheSet(key, value, ttlSeconds, options.namespace);
  return value;
}

export async function invalidateKey(key: string): Promise<void> {
  await safeRedis((r) => r.del(fullKey(key)), 0);
}

/** Delete every cached entry recorded under a namespace. */
export async function invalidateNamespace(...namespaces: string[]): Promise<void> {
  await safeRedis(async (r) => {
    for (const ns of namespaces) {
      const members = await r.smembers(nsKey(ns));
      if (members.length) await r.del(...members);
      await r.del(nsKey(ns));
      logger.debug({ namespace: ns, count: members.length }, "cache invalidated");
    }
  }, undefined);
}
