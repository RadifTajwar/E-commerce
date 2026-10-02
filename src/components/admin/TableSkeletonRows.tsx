import { TD, TR } from "@/components/admin/ui";

/** Placeholder rows matching a table's column count. */
export default function TableSkeletonRows({ columns, rows = 5 }: { columns: number; rows?: number }) {
  return (
    <>
      {[...Array(rows)].map((_, r) => (
        // eslint-disable-next-line react/no-array-index-key
        <TR key={r}>
          {[...Array(columns)].map((__, c) => (
            // eslint-disable-next-line react/no-array-index-key
            <TD key={c}>
              <div className="h-4 w-full animate-pulse rounded bg-slate-200/70 dark:bg-slate-800" />
            </TD>
          ))}
        </TR>
      ))}
    </>
  );
}
