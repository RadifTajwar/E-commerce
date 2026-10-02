import { createHandler } from "@/app/api/_lib/handler";
import { authHeaders, backendRoutes, getBackend } from "@/server/backend";
import { idParam } from "@/validators/common";
import { orderUpdateSchema } from "@/validators/order";

/**
 * GET /api/orders/:id
 * Order ids are unguessable 24-hex ids and the order-received page is shown
 * to guests right after checkout, so this stays readable without a session,
 * matching the previous behaviour.
 */
export const GET = createHandler({ params: idParam }, async ({ params, token }) =>
  getBackend().get(backendRoutes.orders.byId(params.id), { headers: authHeaders(token) }),
);

/** PATCH /api/orders/:id: status / tracking code (admin). */
export const PATCH = createHandler(
  { params: idParam, body: orderUpdateSchema, auth: "admin" },
  async ({ params, body, token }) =>
    getBackend().patch(
      backendRoutes.orders.update(params.id),
      { id: params.id, ...body },
      { headers: authHeaders(token) },
    ),
);
