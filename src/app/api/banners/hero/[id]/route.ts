import { createHandler } from "@/app/api/_lib/handler";
import { CACHE_NS } from "@/config/constants";
import { authHeaders, backendRoutes, getBackend } from "@/server/backend";
import { heroBannerUpdateSchema } from "@/validators/banner";
import { idParam } from "@/validators/common";

export const GET = createHandler(
  {
    params: idParam,
    cache: { ttl: (env) => env.CACHE_TTL_BANNER, key: ({ params }) => `banners:hero:${params.id}`, namespace: CACHE_NS.banners },
  },
  async ({ params }) => getBackend().get(backendRoutes.banners.heroById(params.id)),
);

export const PATCH = createHandler(
  { params: idParam, body: heroBannerUpdateSchema, auth: "admin", invalidate: [CACHE_NS.banners] },
  async ({ params, body, token }) =>
    getBackend().patch(backendRoutes.banners.heroUpdate(params.id), body, { headers: authHeaders(token) }),
);
