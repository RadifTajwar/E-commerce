import { createHandler } from "@/app/api/_lib/handler";
import { CACHE_NS } from "@/config/constants";
import { backendRoutes, getBackend } from "@/server/backend";

/** GET /api/banners/video (cached) */
export const GET = createHandler(
  { cache: { ttl: (env) => env.CACHE_TTL_BANNER, key: () => "banners:video:list", namespace: CACHE_NS.banners } },
  async () => getBackend().get(backendRoutes.banners.videoList),
);
