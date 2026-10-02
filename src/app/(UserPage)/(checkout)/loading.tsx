import Skeleton from "@/components/ui/Skeleton";

/** Cart and checkout: form column beside the order summary. */
export default function CheckoutLoading() {
  return (
    <div className="mx-auto my-10 min-h-[60vh] max-w-7xl px-4">
      <div className="md:flex md:gap-8">
        <div className="w-full space-y-4 md:w-1/2">
          <Skeleton className="h-6 w-52" />
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </div>
        <div className="mt-8 w-full md:mt-0 md:w-1/2">
          <div className="space-y-4 border-2 border-gray-200 p-6">
            <Skeleton className="h-5 w-40" />
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
