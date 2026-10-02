import Skeleton from "@/components/ui/Skeleton";

/** Fallback for storefront routes without a closer loading state. */
export default function StorefrontLoading() {
  return (
    <div className="mx-auto min-h-[70vh] max-w-7xl px-4 py-16">
      <Skeleton className="mx-auto mb-10 h-9 w-64" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3.5 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
