import { createHandler } from "@/app/api/_lib/handler";
import { CACHE_NS } from "@/config/constants";
import { hashKey } from "@/lib/cache";
import { authHeaders, backendRoutes, getBackend } from "@/server/backend";
import { productInputSchema, productListQuerySchema } from "@/validators/catalog";

/** GET /api/products?page&limit&searchTerm&categoryId&... (cached per query) */
export const GET = createHandler(
  {
    query: productListQuerySchema,
    cache: {
      ttl: (env) => env.CACHE_TTL_PRODUCT_LIST,
      key: ({ query }) => `products:list:${hashKey(query)}`,
      namespace: CACHE_NS.products,
    },
  },
  async ({ query }) => getBackend().get(backendRoutes.products.list, { query }),
);

/** POST /api/products (admin) */
export const POST = createHandler(
  { body: productInputSchema, auth: "admin", invalidate: [CACHE_NS.products] },
  async ({ body, token }) =>
    getBackend().post(backendRoutes.products.create, body, { headers: authHeaders(token) }),
);
