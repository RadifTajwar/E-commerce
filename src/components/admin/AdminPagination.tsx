"use client";

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

type PageEntry = number | "start-ellipsis" | "end-ellipsis";

/**
 * Which page numbers to show. Up to seven pages are listed in full; beyond
 * that the run is clipped around the current page so the control never grows
 * with the dataset.
 */
export function getVisiblePages(currentPage: number, totalPages: number): PageEntry[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "end-ellipsis", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [
      1,
      "start-ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [
    1,
    "start-ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "end-ellipsis",
    totalPages,
  ];
}

export interface AdminPaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  /** Disables every control while a request is in flight. */
  isBusy?: boolean;
  className?: string;
}

/**
 * Rows-per-page on the left, page numbers on the right.
 *
 * Monochrome on purpose: in a table the only thing worth colouring is the
 * data, so the current page is marked by filling the pill rather than by hue.
 */
export default function AdminPagination({
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isBusy = false,
  className = "",
}: AdminPaginationProps) {
  const visiblePages = getVisiblePages(page, totalPages);

  const goTo = (next: number) => {
    if (isBusy || next === page || next < 1 || next > totalPages) return;
    onPageChange(next);
  };

  const step =
    "inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white";

  return (
    <nav
      aria-label="Pagination"
      className={`flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      {/* A plain select, not the bordered form primitive: this is a quiet
          control beside the page numbers, not a field being filled in. */}
      <select
        aria-label="Rows per page"
        className="cursor-pointer rounded-lg bg-transparent py-1.5 pl-1 pr-7 text-sm text-slate-600 transition-colors hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:text-white dark:focus:ring-white/10"
        value={String(pageSize)}
        disabled={isBusy}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
            Show {size} per page
          </option>
        ))}
      </select>

      {totalPages > 1 && (
        <ul className="flex items-center gap-1">
          <li>
            <button type="button" className={step} disabled={isBusy || page <= 1} onClick={() => goTo(page - 1)}>
              Previous
            </button>
          </li>

          {visiblePages.map((entry) =>
            typeof entry === "number" ? (
              <li key={entry}>
                <button
                  type="button"
                  aria-current={entry === page ? "page" : undefined}
                  aria-label={`Page ${entry}`}
                  disabled={isBusy}
                  onClick={() => goTo(entry)}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    entry === page
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  } disabled:cursor-not-allowed`}
                >
                  {entry}
                </button>
              </li>
            ) : (
              <li key={entry} aria-hidden="true" className="px-1.5 text-sm text-slate-400">
                …
              </li>
            ),
          )}

          <li>
            <button
              type="button"
              className={step}
              disabled={isBusy || page >= totalPages}
              onClick={() => goTo(page + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
}
