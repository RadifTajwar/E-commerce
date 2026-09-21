import { createHandler } from "@/app/api/_lib/handler";
import { CACHE_NS } from "@/config/constants";
import { backendRoutes, getBackend } from "@/server/backend";

/** GET /api/banners/hero (cached) */
export const GET = createHandler(
  { cache: { ttl: (env) => env.CACHE_TTL_BANNER, key: () => "banners:hero:list", namespace: CACHE_NS.banners } },
  async () => getBackend().get(backendRoutes.banners.heroList),
);
