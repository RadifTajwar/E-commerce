/** Envelope returned by the upstream backend and passed through the proxy unchanged. */
export interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}

export type SortOrder = "asc" | "desc";

export interface ListQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

export type { ApiErrorBody, ApiErrorCode } from "@/lib/api/errors";
