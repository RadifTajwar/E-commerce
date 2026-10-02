import Skeleton from "@/components/ui/Skeleton";

/** Shown while a product page loads: gallery on the left, details on the right. */
export default function ProductLoading() {
  return (
    <div className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10">
      <div className="md:flex md:gap-10">
        <div className="md:w-1/2">
          <Skeleton className="aspect-square w-full" />
          <div className="mt-4 flex gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-20" />
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-5 md:mt-0 md:w-1/2">
          <Skeleton className="mx-auto h-8 w-2/3" />
          <Skeleton className="mx-auto h-5 w-1/3" />
          <div className="flex justify-center gap-2 pt-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[62px] w-[62px] rounded-3xl" />
            ))}
          </div>
          <Skeleton className="mx-auto h-12 w-36" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <div className="space-y-3 pt-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
