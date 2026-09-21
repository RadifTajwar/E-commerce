import { ApiError } from "./errors";

/**
 * Minimal typed HTTP client on top of `fetch`.
 * Works in the browser, in route handlers and in Server Components.
 *
 * Features: base URL, per-request timeout (AbortController), retry with
 * exponential backoff for idempotent methods, JSON in/out, FormData passthrough,
 * and every failure normalised to `ApiError`.
 */

export type HttpMethod = "GET" | "HEAD" | "POST" | "PUT" | "PATCH" | "DELETE";

export type QueryValue = string | number | boolean | null | undefined;
export type Query = Record<string, QueryValue | QueryValue[]>;

export interface RequestOptions {
  method?: HttpMethod;
  query?: Query;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
  timeoutMs?: number;
  /** Override retry count for this call. Only applied to idempotent methods. */
  retries?: number;
  /** Forwarded to fetch (e.g. `cache: "no-store"`, `next: { revalidate }`). */
  fetchOptions?: Omit<RequestInit, "method" | "body" | "headers" | "signal">;
}

export interface HttpClientOptions {
  baseUrl: string;
  timeoutMs?: number;
  maxRetries?: number;
  /** Base delay for backoff; attempt n waits base * 2^n plus jitter. */
  retryBaseDelayMs?: number;
  headers?: HeadersInit | (() => HeadersInit | Promise<HeadersInit>);
  fetchImpl?: typeof fetch;
  /** Called with a value in ms; injectable for tests. */
  sleep?: (ms: number) => Promise<void>;
}

export interface HttpClient {
  request<T = unknown>(path: string, options?: RequestOptions): Promise<T>;
  get<T = unknown>(path: string, options?: Omit<RequestOptions, "method" | "body">): Promise<T>;
  post<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">): Promise<T>;
  put<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">): Promise<T>;
  patch<T = unknown>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">): Promise<T>;
  delete<T = unknown>(path: string, options?: Omit<RequestOptions, "method" | "body">): Promise<T>;
}

const IDEMPOTENT: ReadonlySet<HttpMethod> = new Set(["GET", "HEAD", "PUT", "DELETE"]);

export function buildQueryString(query?: Query): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, raw] of Object.entries(query)) {
    const values = Array.isArray(raw) ? raw : [raw];
    for (const v of values) {
      if (v === undefined || v === null || v === "") continue;
      params.append(key, String(v));
    }
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

export function joinUrl(baseUrl: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = baseUrl.replace(/\/+$/, "");
  const rel = path.replace(/^\/+/, "");
  return `${base}/${rel}`;
}

async function parseBody(res: Response): Promise<unknown> {
  if (res.status === 204 || res.status === 205) return undefined;
  const type = res.headers.get("content-type") ?? "";
  const text = await res.text();
  if (!text) return undefined;
  if (type.includes("json")) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  return text;
}

const defaultSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function createHttpClient(opts: HttpClientOptions): HttpClient {
  const {
    baseUrl,
    timeoutMs = 10_000,
    maxRetries = 2,
    retryBaseDelayMs = 200,
    fetchImpl,
    sleep = defaultSleep,
  } = opts;

  const doFetch: typeof fetch = (input, init) => (fetchImpl ?? globalThis.fetch)(input, init);

  async function resolveBaseHeaders(): Promise<Headers> {
    const h = typeof opts.headers === "function" ? await opts.headers() : opts.headers;
    return new Headers(h ?? {});
  }

  async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const method = (options.method ?? "GET").toUpperCase() as HttpMethod;
    const url = joinUrl(baseUrl, path) + buildQueryString(options.query);
    const retries = IDEMPOTENT.has(method) ? (options.retries ?? maxRetries) : 0;
    const perRequestTimeout = options.timeoutMs ?? timeoutMs;

    const headers = await resolveBaseHeaders();
    new Headers(options.headers ?? {}).forEach((v, k) => headers.set(k, v));

    let body: BodyInit | undefined;
    if (options.body !== undefined && options.body !== null) {
      if (
        typeof FormData !== "undefined" && options.body instanceof FormData
      ) {
        body = options.body;
      } else if (typeof options.body === "string" || options.body instanceof ArrayBuffer || options.body instanceof Blob) {
        body = options.body as BodyInit;
      } else {
        body = JSON.stringify(options.body);
        if (!headers.has("content-type")) headers.set("content-type", "application/json");
      }
    }
    if (!headers.has("accept")) headers.set("accept", "application/json");

    let lastError: ApiError | undefined;

    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(new DOMException("Timeout", "TimeoutError")), perRequestTimeout);
      const onOuterAbort = () => controller.abort(options.signal?.reason);
      options.signal?.addEventListener("abort", onOuterAbort, { once: true });

      try {
        const res = await doFetch(url, {
          ...options.fetchOptions,
          method,
          headers,
          body,
          signal: controller.signal,
        });
        const parsed = await parseBody(res);
        if (res.ok) return parsed as T;

        const requestId = res.headers.get("x-request-id") ?? undefined;
        const err = ApiError.fromResponse(res.status, parsed, requestId);
        if (attempt < retries && err.isRetryable) {
          lastError = err;
          await sleep(backoff(attempt, retryBaseDelayMs));
          continue;
        }
        throw err;
      } catch (e) {
        if (e instanceof ApiError) throw e;
        if (options.signal?.aborted) {
          throw new ApiError("Request aborted", { status: 499, code: "NETWORK_ERROR", cause: e });
        }
        const isTimeout =
          (e instanceof Error && (e.name === "TimeoutError" || e.name === "AbortError")) ||
          controller.signal.aborted;
        const err = isTimeout
          ? new ApiError(`Request timed out after ${perRequestTimeout}ms`, { status: 504, code: "TIMEOUT", cause: e })
          : new ApiError(e instanceof Error ? e.message : "Network error", { status: 503, code: "NETWORK_ERROR", cause: e });
        if (attempt < retries) {
          lastError = err;
          await sleep(backoff(attempt, retryBaseDelayMs));
          continue;
        }
        throw err;
      } finally {
        clearTimeout(timer);
        options.signal?.removeEventListener("abort", onOuterAbort);
      }
    }
    // Unreachable in practice; satisfies the type checker.
    throw lastError ?? new ApiError("Request failed", { status: 500, code: "INTERNAL_ERROR" });
  }

  return {
    request,
    get: (path, options) => request(path, { ...options, method: "GET" }),
    post: (path, body, options) => request(path, { ...options, method: "POST", body }),
    put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
    patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
    delete: (path, options) => request(path, { ...options, method: "DELETE" }),
  };
}

export function backoff(attempt: number, base: number): number {
  const exp = base * 2 ** attempt;
  const jitter = Math.random() * base;
  return Math.min(exp + jitter, 5_000);
}

/**
 * Browser-side client for this app's own /api routes. Same-origin, cookies included.
 * Relative base so it works in any environment without configuration.
 */
export const apiClient: HttpClient = createHttpClient({
  baseUrl: "/",
  timeoutMs: 15_000,
  maxRetries: 1,
});
