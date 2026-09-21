import { createHandler } from "@/app/api/_lib/handler";
import { authHeaders, backendRoutes, getBackend } from "@/server/backend";
import { orderInputSchema, orderListQuerySchema } from "@/validators/order";

/** GET /api/orders: all orders with filters (admin). Never cached. */
export const GET = createHandler({ query: orderListQuerySchema, auth: "admin" }, async ({ query, token }) =>
  getBackend().get(backendRoutes.orders.list, { query, headers: authHeaders(token) }),
);

/** POST /api/orders: place an order (guest checkout allowed, as before). */
export const POST = createHandler({ body: orderInputSchema }, async ({ body, token }) =>
  getBackend().post(backendRoutes.orders.create, body, { headers: authHeaders(token) }),
);
