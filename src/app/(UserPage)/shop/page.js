"use client";

import { Suspense } from "react";
import ShopBrowser from "@/components/storefront/shop/ShopBrowser";

/** useSearchParams() requires a Suspense boundary for static prerendering. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <ShopBrowser />
    </Suspense>
  );
}
