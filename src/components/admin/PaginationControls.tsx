"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPageNumbers } from "./usePagination";

export interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * The pagination block every admin table used to repeat. Previous/Next are
 * marked `aria-disabled` with a no-op handler instead of being given a
 * `disabled` attribute, which React cannot put on the underlying element.
 */
export function PaginationControls({
  page,
  totalPages,
  onPageChange,
  className = "mb-4",
}: PaginationControlsProps) {
  const isFirst = page <= 1;
  const isLast = totalPages === 0 || page >= totalPages;

  return (
    <div className={className}>
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={isFirst}
              onClick={() => {
                if (!isFirst) onPageChange(page - 1);
              }}
              className={` ${isFirst ? "cursor-not-allowed" : "cursor-pointer"}`}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {getPageNumbers(page, totalPages).map((pageNumber, index) =>
            pageNumber === "..." ? (
              <PaginationItem key={`gap-${index}`}>
                <span className="px-3 py-1 text-gray-500">...</span>
              </PaginationItem>
            ) : (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  onClick={() => onPageChange(pageNumber)}
                  className={`${
                    page === pageNumber ? "bg-blue-500 text-white font-bold" : "bg-gray-200 text-black"
                  } rounded px-3 py-1`}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              aria-disabled={isLast}
              onClick={() => {
                if (!isLast) onPageChange(page + 1);
              }}
              className={` ${isLast ? "cursor-not-allowed" : "cursor-pointer"}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default PaginationControls;
