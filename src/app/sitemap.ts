import type { MetadataRoute } from "next";
import { ROUTES } from "@/config/constants";
import { clientEnv } from "@/config/env";
import { slugify } from "@/lib/utils";
import { getCategories, getParentCategories, getProducts, safely } from "@/server/queries";

/** Rebuilt hourly, so new products and categories are listed without a deploy. */
export const revalidate = 3600;

/** /sitemap.xml: every public page a search engine should know about. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => new URL(path, clientEnv.NEXT_PUBLIC_APP_URL).toString();

  // A backend hiccup should shrink the sitemap, not fail it.
  const [{ products }, parents, categories] = await Promise.all([
    safely("sitemap:products", () => getProducts({ limit: 1000 }), {
      products: [],
      meta: { page: 1, limit: 0, total: 0 },
    }),
    safely("sitemap:parentCategories", getParentCategories, []),
    safely("sitemap:categories", getCategories, []),
  ]);

  // Category URLs are built from names, exactly as the shop links to them.
  const categoryPages = parents.flatMap((parent) => [
    ROUTES.shopCategory(slugify(parent.name)),
    ...categories
      .filter((c) => c.parentCategoryId === parent.id)
      .map((c) => ROUTES.shopCategory(slugify(parent.name), slugify(c.name))),
  ]);

  return [
    { url: url(ROUTES.home), changeFrequency: "daily", priority: 1 },
    { url: url(ROUTES.shop), changeFrequency: "daily", priority: 0.8 },
    ...categoryPages.map((path) => ({
      url: url(path),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...products
      .filter((p) => p.slug)
      .map((p) => ({
        url: url(ROUTES.product(p.slug)),
        lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
  ];
}
