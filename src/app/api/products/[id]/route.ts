import { createHandler } from "@/app/api/_lib/handler";
import { CACHE_NS } from "@/config/constants";
import { authHeaders, backendRoutes, getBackend } from "@/server/backend";
import { productUpdateSchema } from "@/validators/catalog";
import { idParam } from "@/validators/common";

export const GET = createHandler(
  {
    params: idParam,
    cache: { ttl: (env) => env.CACHE_TTL_PRODUCT, key: ({ params }) => `products:id:${params.id}`, namespace: CACHE_NS.products },
  },
  async ({ params }) => getBackend().get(backendRoutes.products.byId(params.id)),
);

export const PATCH = createHandler(
  { params: idParam, body: productUpdateSchema, auth: "admin", invalidate: [CACHE_NS.products] },
  async ({ params, body, token }) =>
    getBackend().patch(backendRoutes.products.update(params.id), body, { headers: authHeaders(token) }),
);

export const DELETE = createHandler(
  { params: idParam, auth: "admin", invalidate: [CACHE_NS.products] },
  async ({ params, token }) =>
    getBackend().delete(backendRoutes.products.remove(params.id), { headers: authHeaders(token) }),
);
