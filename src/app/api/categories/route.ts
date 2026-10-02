import { createHandler } from "@/app/api/_lib/handler";
import { CACHE_NS } from "@/config/constants";
import { authHeaders, backendRoutes, getBackend } from "@/server/backend";
import { categoryInputSchema } from "@/validators/catalog";

/** GET /api/categories: all categories (cached). */
export const GET = createHandler(
  {
    cache: { ttl: (env) => env.CACHE_TTL_CATALOG, key: () => "categories:list", namespace: CACHE_NS.categories },
  },
  async () => getBackend().get(backendRoutes.categories.list),
);

/** POST /api/categories: create (admin). */
export const POST = createHandler(
  { body: categoryInputSchema, auth: "admin", invalidate: [CACHE_NS.categories, CACHE_NS.products] },
  async ({ body, token }) =>
    getBackend().post(backendRoutes.categories.create, body, { headers: authHeaders(token) }),
);
