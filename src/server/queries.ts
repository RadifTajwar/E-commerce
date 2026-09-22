import "server-only";
import { CACHE_NS } from "@/config/constants";
import { getServerEnv } from "@/config/env";
import { ApiError } from "@/lib/api/errors";
import { hashKey, withCache } from "@/lib/cache";
import { logger } from "@/lib/logger";
import type { ApiEnvelope, PaginationMeta } from "@/types/api";
import type { HeroBanner, VideoBanner } from "@/types/banner";
import type { Category, ParentCategory } from "@/types/category";
import type { Product, ProductColor, ProductListQuery } from "@/types/product";
import { backendRoutes, getBackend } from "./backend";

/**
 * Server-side data access for Server Components.
 *
 * These call the backend directly instead of going through this app's own
 * /api routes: a Server Component and a route handler run in the same process,
 * so an extra HTTP hop would only add latency. Cache keys and namespaces match
 * the proxy exactly, so both share the same Redis entries and a write through
 * the proxy invalidates what a page cached.
 *
 * Every function has a `safe` behaviour note: page-level code should not crash
 * a whole route because one optional list failed to load.
 */

const ttl = () => getServerEnv();

/** Read-through cache around a backend GET. */
function cached<T>(key: string, namespace: string, seconds: number, fetcher: () => Promise<T>) {
  return withCache(key, seconds, fetcher, { namespace });
}

export async function getCategories(): Promise<Category[]> {
  const res = await cached<ApiEnvelope<Category[]>>(
    "categories:list",
    CACHE_NS.categories,
    ttl().CACHE_TTL_CATALOG,
    () => getBackend().get(backendRoutes.categories.list),
  );
  return res?.data ?? [];
}

export async function getParentCategories(): Promise<ParentCategory[]> {
  const res = await cached<ApiEnvelope<ParentCategory[]>>(
    "parent-categories:list",
    CACHE_NS.parentCategories,
    ttl().CACHE_TTL_CATALOG,
    () => getBackend().get(backendRoutes.parentCategories.list),
  );
  return res?.data ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await cached<ApiEnvelope<Product>>(
      `products:slug:${slug}`,
      CACHE_NS.products,
      ttl().CACHE_TTL_PRODUCT,
      () => getBackend().get(backendRoutes.products.bySlug(slug)),
    );
    return res?.data ?? null;
  } catch (err) {
    // A missing product is a 404 for the page; anything else is a real outage
    // and should surface as an error boundary rather than a silent empty page.
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function getProducts(
  query: ProductListQuery = {},
): Promise<{ products: Product[]; meta: PaginationMeta }> {
  const res = await cached<ApiEnvelope<Product[]>>(
    `products:list:${hashKey(query)}`,
    CACHE_NS.products,
    ttl().CACHE_TTL_PRODUCT_LIST,
    () => getBackend().get(backendRoutes.products.list, { query: { ...query } }),
  );
  return {
    products: res?.data ?? [],
    meta: res?.meta ?? { page: 1, limit: 0, total: res?.data?.length ?? 0 },
  };
}

export async function getProductColors(): Promise<ProductColor[]> {
  const res = await cached<ApiEnvelope<ProductColor[]>>(
    "products:colors",
    CACHE_NS.products,
    ttl().CACHE_TTL_CATALOG,
    () => getBackend().get(backendRoutes.products.colors),
  );
  return res?.data ?? [];
}

export async function getHeroBanners(): Promise<HeroBanner[]> {
  const res = await cached<ApiEnvelope<HeroBanner[]>>(
    "banners:hero:list",
    CACHE_NS.banners,
    ttl().CACHE_TTL_BANNER,
    () => getBackend().get(backendRoutes.banners.heroList),
  );
  return res?.data ?? [];
}

export async function getVideoBanners(): Promise<VideoBanner[]> {
  const res = await cached<ApiEnvelope<VideoBanner[]>>(
    "banners:video:list",
    CACHE_NS.banners,
    ttl().CACHE_TTL_BANNER,
    () => getBackend().get(backendRoutes.banners.videoList),
  );
  return res?.data ?? [];
}

/**
 * Run a query but never let it fail the page: on error it logs and returns the
 * fallback. Use it for supporting data (navigation taxonomy, banners), not for
 * the record a page is actually about.
 */
export async function safely<T>(label: string, fetcher: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fetcher();
  } catch (err) {
    logger.warn({ err: err instanceof Error ? err.message : err, query: label }, "server query failed");
    return fallback;
  }
}
