/**
 * Normalised error type for every HTTP failure in the app, on both sides of
 * the proxy. Route handlers serialise it as `{ error: { code, message, details, requestId } }`.
 */

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "NETWORK_ERROR"
  | "UPSTREAM_ERROR"
  | "INTERNAL_ERROR";

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
    requestId?: string;
  };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly details?: unknown;
  readonly requestId?: string;

  constructor(
    message: string,
    options: { status: number; code?: ApiErrorCode; details?: unknown; requestId?: string; cause?: unknown },
  ) {
    super(message, { cause: options.cause });
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code ?? codeFromStatus(options.status);
    this.details = options.details;
    this.requestId = options.requestId;
  }

  get isRetryable(): boolean {
    return this.code === "TIMEOUT" || this.code === "NETWORK_ERROR" || this.status >= 502;
  }

  toBody(): ApiErrorBody {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details !== undefined ? { details: this.details } : {}),
        ...(this.requestId ? { requestId: this.requestId } : {}),
      },
    };
  }

  /** Build an ApiError from a non-2xx response body of unknown shape. */
  static fromResponse(status: number, body: unknown, requestId?: string): ApiError {
    const message = extractMessage(body) ?? defaultMessage(status);
    const code = extractCode(body) ?? codeFromStatus(status);
    const details = extractDetails(body);
    return new ApiError(message, { status, code, details, requestId });
  }

  static from(err: unknown, fallbackStatus = 500): ApiError {
    if (err instanceof ApiError) return err;
    if (err instanceof Error) {
      if (err.name === "AbortError" || err.name === "TimeoutError") {
        return new ApiError("Request timed out", { status: 504, code: "TIMEOUT", cause: err });
      }
      return new ApiError(err.message || "Unexpected error", {
        status: fallbackStatus,
        code: fallbackStatus >= 500 ? "INTERNAL_ERROR" : codeFromStatus(fallbackStatus),
        cause: err,
      });
    }
    return new ApiError("Unexpected error", { status: fallbackStatus, code: "INTERNAL_ERROR", cause: err });
  }
}

export const isApiError = (err: unknown): err is ApiError => err instanceof ApiError;

export function codeFromStatus(status: number): ApiErrorCode {
  switch (status) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "CONFLICT";
    case 422:
      return "VALIDATION_ERROR";
    case 429:
      return "RATE_LIMITED";
    case 504:
      return "TIMEOUT";
    default:
      return status >= 500 ? "UPSTREAM_ERROR" : "BAD_REQUEST";
  }
}

function defaultMessage(status: number): string {
  if (status === 404) return "Not found";
  if (status === 401) return "Unauthorized";
  if (status === 403) return "Forbidden";
  if (status === 429) return "Too many requests";
  if (status >= 500) return "Upstream service error";
  return "Request failed";
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function extractMessage(body: unknown): string | undefined {
  if (typeof body === "string" && body.trim()) return body.slice(0, 500);
  if (!isRecord(body)) return undefined;
  const err = isRecord(body.error) ? body.error : undefined;
  const candidates = [err?.message, body.message, body.errorMessage, body.msg];
  const found = candidates.find((c) => typeof c === "string" && c.trim());
  return typeof found === "string" ? found : undefined;
}

function extractCode(body: unknown): ApiErrorCode | undefined {
  if (!isRecord(body)) return undefined;
  const err = isRecord(body.error) ? body.error : undefined;
  const code = err?.code;
  return typeof code === "string" ? (code as ApiErrorCode) : undefined;
}

function extractDetails(body: unknown): unknown {
  if (!isRecord(body)) return undefined;
  const err = isRecord(body.error) ? body.error : undefined;
  return err?.details ?? body.errorMessages ?? body.errors ?? body.details;
}

/** Human-readable message for UI code, regardless of error shape. */
export function getErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (isApiError(err)) return err.message || fallback;
  if (err instanceof Error) return err.message || fallback;
  if (typeof err === "string") return err;
  return extractMessage(err) ?? fallback;
}
