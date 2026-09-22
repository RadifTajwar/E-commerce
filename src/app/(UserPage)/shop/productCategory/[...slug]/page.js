"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import ShopBrowser from "@/components/storefront/shop/ShopBrowser";

function PageContent() {
  const params = useParams();
  const slug = Array.isArray(params?.slug)
    ? params.slug
    : params?.slug
      ? [params.slug]
      : undefined;

  return <ShopBrowser slug={slug} />;
}

/** useSearchParams() requires a Suspense boundary for static prerendering. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  );
}
