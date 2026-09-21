import { createHandler } from "@/app/api/_lib/handler";
import { CACHE_NS } from "@/config/constants";
import { backendRoutes, getBackend } from "@/server/backend";

/** GET /api/products/colors (cached) */
export const GET = createHandler(
  {
    cache: { ttl: (env) => env.CACHE_TTL_CATALOG, key: () => "products:colors", namespace: CACHE_NS.products },
  },
  async () => getBackend().get(backendRoutes.products.colors),
);
