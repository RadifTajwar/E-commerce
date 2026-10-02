import "server-only";
import Redis from "ioredis";
import { getServerEnv } from "@/config/env";
import { logger } from "@/lib/logger";

/**
 * Redis singleton (ioredis).
 *
 * - Survives Next.js hot reload by hanging the instance on `globalThis`.
 * - Lazy connect; never blocks a request while reconnecting
 *   (`enableOfflineQueue: false` makes commands fail fast when disconnected).
 * - `getRedis()` returns `null` when REDIS_URL is unset or the connection is
 *   known to be down, so callers can fall back to the direct path.
 *
 * Why ioredis and not @upstash/redis: one library works identically against the
 * docker-compose Redis locally and any managed Redis (including Upstash's TCP
 * endpoint) in production. Everything goes through cache.ts and rate-limit.ts,
 * so swapping this file for an HTTP client later is a single-file change.
 */

type RedisState = {
  client: Redis | null;
  available: boolean;
  lastErrorLoggedAt: number;
  initialised: boolean;
};

declare global {
  // eslint-disable-next-line no-var
  var __khalammaRedis: RedisState | undefined;
}

const state: RedisState = globalThis.__khalammaRedis ?? {
  client: null,
  available: false,
  lastErrorLoggedAt: 0,
  initialised: false,
};
if (process.env.NODE_ENV !== "production") globalThis.__khalammaRedis = state;

const ERROR_LOG_INTERVAL_MS = 30_000;

function warnThrottled(msg: string, err?: unknown) {
  const now = Date.now();
  if (now - state.lastErrorLoggedAt > ERROR_LOG_INTERVAL_MS) {
    state.lastErrorLoggedAt = now;
    logger.warn({ err: err instanceof Error ? err.message : err }, msg);
  }
}

function init(): void {
  if (state.initialised) return;
  state.initialised = true;

  const { REDIS_URL } = getServerEnv();
  if (!REDIS_URL) {
    logger.warn("REDIS_URL is not set: caching and rate limiting are disabled");
    return;
  }

  const client = new Redis(REDIS_URL, {
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    connectTimeout: 2_000,
    commandTimeout: 1_000,
    retryStrategy: (times) => Math.min(times * 500, 10_000),
  });

  client.on("ready", () => {
    state.available = true;
    logger.info("Redis connected");
  });
  client.on("end", () => {
    state.available = false;
  });
  client.on("error", (err) => {
    state.available = false;
    warnThrottled("Redis error: continuing without cache", err);
  });

  client.connect().catch((err) => warnThrottled("Redis connect failed: continuing without cache", err));
  state.client = client;
}

/** The shared client, or null when Redis is not configured or currently unavailable. */
export function getRedis(): Redis | null {
  init();
  return state.available && state.client ? state.client : null;
}

export function isRedisAvailable(): boolean {
  init();
  return state.available;
}

/** Run a Redis operation; on any failure log (throttled) and return `fallback`. */
export async function safeRedis<T>(op: (client: Redis) => Promise<T>, fallback: T): Promise<T> {
  const client = getRedis();
  if (!client) return fallback;
  try {
    return await op(client);
  } catch (err) {
    warnThrottled("Redis command failed: falling back", err);
    return fallback;
  }
}

/** For graceful shutdown in scripts/tests. */
export async function closeRedis(): Promise<void> {
  if (state.client) {
    await state.client.quit().catch(() => undefined);
    state.client = null;
    state.available = false;
    state.initialised = false;
  }
}
