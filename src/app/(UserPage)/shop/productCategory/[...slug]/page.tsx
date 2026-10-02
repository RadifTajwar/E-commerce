import type { Metadata } from "next";
import { Suspense } from "react";
import ShopBrowser from "@/components/storefront/shop/ShopBrowser";
import { slugify } from "@/lib/utils";
import { getCategories, getParentCategories, safely } from "@/server/queries";

interface PageProps {
  params: { slug: string[] };
}

export const revalidate = 600;

/** Resolves the slug back to the category name so the tab title is meaningful. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [parentSlug, childSlug] = params.slug ?? [];
  const [parentCategories, categories] = await Promise.all([
    safely("parentCategories", getParentCategories, []),
    safely("categories", getCategories, []),
  ]);

  const parent = parentCategories.find((p) => slugify(p.name) === parentSlug);
  const child = childSlug
    ? categories.find((c) => c.parentCategoryId === parent?.id && slugify(c.name) === childSlug)
    : undefined;

  const name = child?.name ?? parent?.name;
  if (!name) return { title: "Shop" };

  return {
    title: name,
    description: `Browse our ${name} collection.`,
    alternates: { canonical: `/shop/productCategory/${params.slug.join("/")}` },
  };
}

export default async function ProductCategoryPage({ params }: PageProps) {
  const [parentCategories, categories] = await Promise.all([
    safely("parentCategories", getParentCategories, []),
    safely("categories", getCategories, []),
  ]);

  return (
    <Suspense fallback={null}>
      <ShopBrowser
        slug={params.slug}
        initialParentCategories={parentCategories}
        initialCategories={categories}
      />
    </Suspense>
  );
}
