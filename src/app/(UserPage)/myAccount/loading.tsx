import Skeleton from "@/components/ui/Skeleton";

/** Fills the account panel while a sub-page loads; the sidebar stays put. */
export default function AccountLoading() {
  return (
    <div className="min-h-[60vh] w-full px-4 py-2.5 sm:px-8 md:w-2/3 lg:w-3/4">
      <Skeleton className="mb-6 h-7 w-56" />
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-11 w-full" />
        ))}
      </div>
      <Skeleton className="mt-6 h-12 w-44" />
    </div>
  );
}
