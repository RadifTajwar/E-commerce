import { createHandler } from "@/app/api/_lib/handler";
import { CACHE_NS } from "@/config/constants";
import { authHeaders, backendRoutes, getBackend } from "@/server/backend";
import { parentCategoryInputSchema } from "@/validators/catalog";

/** GET /api/parent-categories (cached) */
export const GET = createHandler(
  {
    cache: {
      ttl: (env) => env.CACHE_TTL_CATALOG,
      key: () => "parent-categories:list",
      namespace: CACHE_NS.parentCategories,
    },
  },
  async () => getBackend().get(backendRoutes.parentCategories.list),
);

/** POST /api/parent-categories (admin) */
export const POST = createHandler(
  {
    body: parentCategoryInputSchema,
    auth: "admin",
    invalidate: [CACHE_NS.parentCategories, CACHE_NS.categories, CACHE_NS.products],
  },
  async ({ body, token }) =>
    getBackend().post(backendRoutes.parentCategories.create, body, { headers: authHeaders(token) }),
);
