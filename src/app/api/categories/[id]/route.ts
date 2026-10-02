import { createHandler } from "@/app/api/_lib/handler";
import { CACHE_NS } from "@/config/constants";
import { authHeaders, backendRoutes, getBackend } from "@/server/backend";
import { categoryInputSchema } from "@/validators/catalog";
import { idParam } from "@/validators/common";

const invalidate = [CACHE_NS.categories, CACHE_NS.products];

/** GET /api/categories/:id */
export const GET = createHandler(
  {
    params: idParam,
    cache: { ttl: (env) => env.CACHE_TTL_CATALOG, key: ({ params }) => `categories:${params.id}`, namespace: CACHE_NS.categories },
  },
  async ({ params }) => getBackend().get(backendRoutes.categories.byId(params.id)),
);

/** PATCH /api/categories/:id (admin) */
export const PATCH = createHandler(
  { params: idParam, body: categoryInputSchema.partial(), auth: "admin", invalidate },
  async ({ params, body, token }) =>
    getBackend().patch(backendRoutes.categories.update(params.id), body, { headers: authHeaders(token) }),
);

/** DELETE /api/categories/:id (admin) */
export const DELETE = createHandler(
  { params: idParam, auth: "admin", invalidate },
  async ({ params, token }) =>
    getBackend().delete(backendRoutes.categories.remove(params.id), { headers: authHeaders(token) }),
);
