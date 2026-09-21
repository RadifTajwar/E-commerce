import { createHandler } from "@/app/api/_lib/handler";
import { CACHE_NS } from "@/config/constants";
import { backendRoutes, getBackend } from "@/server/backend";
import { slugParam } from "@/validators/common";

/** GET /api/products/slug/:slug (cached) */
export const GET = createHandler(
  {
    params: slugParam,
    cache: {
      ttl: (env) => env.CACHE_TTL_PRODUCT,
      key: ({ params }) => `products:slug:${params.slug}`,
      namespace: CACHE_NS.products,
    },
  },
  async ({ params }) => getBackend().get(backendRoutes.products.bySlug(params.slug)),
);
