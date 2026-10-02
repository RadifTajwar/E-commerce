import { createHandler } from "@/app/api/_lib/handler";
import { CACHE_NS } from "@/config/constants";
import { authHeaders, backendRoutes, getBackend } from "@/server/backend";
import { parentCategoryInputSchema } from "@/validators/catalog";
import { idParam } from "@/validators/common";

const invalidate = [CACHE_NS.parentCategories, CACHE_NS.categories, CACHE_NS.products];

export const GET = createHandler(
  {
    params: idParam,
    cache: {
      ttl: (env) => env.CACHE_TTL_CATALOG,
      key: ({ params }) => `parent-categories:${params.id}`,
      namespace: CACHE_NS.parentCategories,
    },
  },
  async ({ params }) => getBackend().get(backendRoutes.parentCategories.byId(params.id)),
);

export const PATCH = createHandler(
  { params: idParam, body: parentCategoryInputSchema.partial(), auth: "admin", invalidate },
  async ({ params, body, token }) =>
    getBackend().patch(backendRoutes.parentCategories.update(params.id), body, { headers: authHeaders(token) }),
);

export const DELETE = createHandler(
  { params: idParam, auth: "admin", invalidate },
  async ({ params, token }) =>
    getBackend().delete(backendRoutes.parentCategories.remove(params.id), { headers: authHeaders(token) }),
);
