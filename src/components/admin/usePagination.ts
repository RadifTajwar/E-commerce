"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { PaginationMeta } from "@/types";

/**
 * Page numbers with "..." gaps, exactly as every admin table used to build
 * them with its own copy of `getPageNumbers()`.
 */
export function getPageNumbers(currentPage: number, totalPages: number): Array<number | "..."> {
  const pageNumbers: Array<number | "..."> = [];

  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    return pageNumbers;
  }

  pageNumbers.push(1);

  if (currentPage <= 4) {
    for (let i = 2; i <= 5; i++) pageNumbers.push(i);
    pageNumbers.push("...");
  } else if (currentPage > 4 && currentPage < totalPages - 3) {
    pageNumbers.push("...");
    pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
    pageNumbers.push("...");
  } else {
    pageNumbers.push("...");
    for (let i = totalPages - 4; i < totalPages; i++) pageNumbers.push(i);
  }

  pageNumbers.push(totalPages);
  return pageNumbers;
}

export interface UsePaginationResult {
  page: number;
  totalPages: number;
  goToPage: (page: number) => void;
}

/**
 * Current page (kept in the `?page=` query string) plus the page count derived
 * from the list's pagination meta. `onPageChange` is what tells the list to
 * refetch (the `...Fetched` flags the admin tables use).
 */
export function usePagination(
  meta: PaginationMeta | undefined,
  fallbackLimit: number,
  onPageChange: () => void,
): UsePaginationResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(() => Number(searchParams.get("page")) || 1);

  const metaPage = meta?.page;
  useEffect(() => {
    if (metaPage) setPage(metaPage);
  }, [metaPage]);

  const limit = meta?.limit || fallbackLimit;
  const total = meta?.total ?? 0;
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

  const goToPage = useCallback(
    (next: number) => {
      if (next < 1 || next > totalPages) return;
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(next));
      router.push(`?${params.toString()}`, { scroll: false });
      setPage(next);
      onPageChange();
    },
    [router, searchParams, totalPages, onPageChange],
  );

  return { page, totalPages, goToPage };
}
