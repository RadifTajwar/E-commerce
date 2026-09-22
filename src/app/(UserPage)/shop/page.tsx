import type { Metadata } from "next";
import { Suspense } from "react";
import ShopBrowser from "@/components/storefront/shop/ShopBrowser";
import { getCategories, getParentCategories, safely } from "@/server/queries";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the full leather collection: bags, wallets and accessories.",
};

/** Regenerated every 10 minutes; product results themselves are filtered client-side. */
export const revalidate = 600;

export default async function ShopPage() {
  // Supporting data: a failure here must not take the page down.
  const [parentCategories, categories] = await Promise.all([
    safely("parentCategories", getParentCategories, []),
    safely("categories", getCategories, []),
  ]);

  return (
    // ShopBrowser reads the query string, which needs a Suspense boundary.
    <Suspense fallback={null}>
      <ShopBrowser initialParentCategories={parentCategories} initialCategories={categories} />
    </Suspense>
  );
}
