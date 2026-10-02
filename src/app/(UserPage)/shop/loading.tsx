import Skeleton from "@/components/ui/Skeleton";

/** Shown while the shop route loads. Mirrors the filter rail + product grid. */
export default function ShopLoading() {
  return (
    <div className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10">
      <div className="lg:flex lg:gap-8">
        <aside className="hidden w-64 shrink-0 space-y-6 lg:block">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </div>
          ))}
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-44" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3.5 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
