import "server-only";
import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import type { ZodType } from "zod";
import { getServerEnv, type ServerEnv } from "@/config/env";
import { ApiError, gatewayStatus } from "@/lib/api/errors";
import { sessionFromToken } from "@/lib/auth";
import { invalidateNamespace, withCache } from "@/lib/cache";
import { logger } from "@/lib/logger";
import { clientIpFromHeaders, rateLimit } from "@/lib/rate-limit";
import type { Session } from "@/types/user";

/**
 * Wrapper for every BFF route handler. Provides, in order:
 *   request id → rate limit → auth → validation → cache (GET) → handler → invalidation → JSON.
 * Every failure becomes `{ error: { code, message, details?, requestId } }`.
 */

export type RateLimitGroup = "public" | "write" | "auth";

export interface HandlerContext<P, Q, B> {
  req: NextRequest;
  params: P;
  query: Q;
  body: B;
  requestId: string;
  session: Session | null;
  /** Raw bearer token from the cookie, for forwarding to the backend. */
  token: string | undefined;
  env: ServerEnv;
}

export interface HandlerOptions<P, Q, B> {
  params?: ZodType<P>;
  query?: ZodType<Q>;
  body?: ZodType<B>;
  /** "user": any valid session; "admin": session with role admin. */
  auth?: "user" | "admin";
  rateLimit?: RateLimitGroup | false;
  cache?: {
    ttl: number | ((env: ServerEnv) => number);
    key: (ctx: HandlerContext<P, Q, B>) => string;
    namespace: string;
  };
  /** Cache namespaces to invalidate after a successful non-GET call. */
  invalidate?: string[];
}

type RouteArgs = { params?: Record<string, string | string[]> };
export type RouteHandler = (req: NextRequest, args: RouteArgs) => Promise<Response>;

const EMPTY = {} as const;

function limitFor(group: RateLimitGroup, env: ServerEnv): number {
  if (group === "auth") return env.RATE_LIMIT_AUTH;
  if (group === "write") return env.RATE_LIMIT_WRITE;
  return env.RATE_LIMIT_PUBLIC;
}

async function readJson(req: NextRequest): Promise<unknown> {
  const type = req.headers.get("content-type") ?? "";
  if (!type.includes("json")) return undefined;
  const text = await req.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError("Malformed JSON body", { status: 400, code: "BAD_REQUEST" });
  }
}

function parseOrThrow<T>(schema: ZodType<T> | undefined, input: unknown, where: string): T {
  if (!schema) return input as T;
  const result = schema.safeParse(input);
  if (result.success) return result.data;
  throw new ApiError(`Invalid ${where}`, {
    status: 400,
    code: "VALIDATION_ERROR",
    details: result.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
  });
}

export function jsonResponse(data: unknown, init: { status?: number; requestId?: string; headers?: HeadersInit } = {}) {
  const headers = new Headers(init.headers);
  headers.set("cache-control", "no-store");
  if (init.requestId) headers.set("x-request-id", init.requestId);
  return NextResponse.json(data, { status: init.status ?? 200, headers });
}

export function errorResponse(err: unknown, requestId: string): NextResponse {
  const apiErr = ApiError.from(err);
  const status = gatewayStatus(apiErr);
  const body = new ApiError(apiErr.message, { status, code: apiErr.code, details: apiErr.details, requestId }).toBody();
  if (status >= 500) logger.error({ requestId, err: apiErr, cause: apiErr.cause }, "request failed");
  else logger.warn({ requestId, status, code: apiErr.code, message: apiErr.message }, "request rejected");
  return jsonResponse(body, { status, requestId });
}

export function createHandler<P = typeof EMPTY, Q = typeof EMPTY, B = undefined>(
  options: HandlerOptions<P, Q, B>,
  fn: (ctx: HandlerContext<P, Q, B>) => Promise<unknown>,
): RouteHandler {
  return async (req, args) => {
    const requestId = req.headers.get("x-request-id") ?? randomUUID();
    const started = Date.now();

    try {
      const env = getServerEnv();

      // Rate limit
      const group = options.rateLimit === undefined ? (req.method === "GET" ? "public" : "write") : options.rateLimit;
      if (group) {
        const ip = clientIpFromHeaders(req.headers);
        const rl = await rateLimit({ key: `${ip}:${group}`, limit: limitFor(group, env) });
        if (!rl.allowed) {
          const res = errorResponse(
            new ApiError("Too many requests", { status: 429, code: "RATE_LIMITED" }),
            requestId,
          );
          res.headers.set("retry-after", String(rl.retryAfter));
          res.headers.set("x-ratelimit-limit", String(rl.limit));
          res.headers.set("x-ratelimit-remaining", String(rl.remaining));
          return res;
        }
      }

      // Auth
      const token = req.cookies.get(env.AUTH_COOKIE_NAME)?.value;
      const session = await sessionFromToken(token, env.JWT_SECRET);
      if (options.auth) {
        if (!session) throw new ApiError("Authentication required", { status: 401, code: "UNAUTHORIZED" });
        if (options.auth === "admin" && session.role !== "admin") {
          throw new ApiError("Admin access required", { status: 403, code: "FORBIDDEN" });
        }
      }

      // Validation
      const params = parseOrThrow(options.params, args.params ?? {}, "route parameters");
      const query = parseOrThrow(options.query, Object.fromEntries(req.nextUrl.searchParams.entries()), "query");
      const rawBody = options.body ? await readJson(req) : undefined;
      const body = parseOrThrow(options.body, rawBody ?? {}, "request body");

      const ctx: HandlerContext<P, Q, B> = { req, params, query, body, requestId, session, token, env };

      // Execute (with cache for GET)
      let result: unknown;
      if (options.cache && req.method === "GET") {
        const ttl = typeof options.cache.ttl === "function" ? options.cache.ttl(env) : options.cache.ttl;
        const bypass = env.NODE_ENV !== "production" && req.nextUrl.searchParams.get("fresh") === "1";
        result = await withCache(options.cache.key(ctx), ttl, () => fn(ctx), {
          namespace: options.cache.namespace,
          bypass,
        });
      } else {
        result = await fn(ctx);
      }

      if (options.invalidate?.length && req.method !== "GET") {
        await invalidateNamespace(...options.invalidate);
      }

      logger.debug({ requestId, method: req.method, path: req.nextUrl.pathname, ms: Date.now() - started }, "ok");
      if (result instanceof Response) {
        result.headers.set("x-request-id", requestId);
        return result;
      }
      return jsonResponse(result ?? {}, { requestId });
    } catch (err) {
      return errorResponse(err, requestId);
    }
  };
}
