import Skeleton from "@/components/ui/Skeleton";

/** Placeholder rows shaped like the account order list. */
export default function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="w-full px-4 py-2.5 sm:px-8 md:w-2/3 lg:w-3/4">
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-3.5 w-16" />
        ))}
      </div>
      <div className="space-y-5">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-52" />
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3.5 w-14" />
            <Skeleton className="h-9 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
