import { apiClient } from "@/lib/api/client";
import type { ApiEnvelope, Paginated, PaginationMeta } from "@/types/api";

/**
 * Helpers shared by the browser-side services. Every service talks only to
 * this app's own /api routes; the upstream backend is never referenced here.
 */

export const http = apiClient;

/** Unwrap the `{ data }` envelope the backend returns and the proxy passes through. */
export function unwrap<T>(res: ApiEnvelope<T> | T): T {
  if (res && typeof res === "object" && "data" in (res as object)) {
    return (res as ApiEnvelope<T>).data;
  }
  return res as T;
}

export function unwrapPaginated<T>(res: ApiEnvelope<T[]>): Paginated<T> {
  const fallback: PaginationMeta = { page: 1, limit: res.data?.length ?? 0, total: res.data?.length ?? 0 };
  return { items: res.data ?? [], meta: res.meta ?? fallback };
}
