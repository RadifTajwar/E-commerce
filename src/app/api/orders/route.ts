import { createHandler } from "@/app/api/_lib/handler";
import { ORDER_STATUS } from "@/config/constants";
import { ApiError } from "@/lib/api/errors";
import { authHeaders, backendRoutes, getBackend } from "@/server/backend";
import type { ApiEnvelope } from "@/types/api";
import type { Product } from "@/types/product";
import { orderInputSchema, orderListQuerySchema } from "@/validators/order";

/** GET /api/orders: all orders with filters (admin). Never cached. */
export const GET = createHandler({ query: orderListQuerySchema, auth: "admin" }, async ({ query, token }) =>
  getBackend().get(backendRoutes.orders.list, { query, headers: authHeaders(token) }),
);

/**
 * POST /api/orders: place an order (guest checkout allowed, as before).
 *
 * The total is priced here from the catalogue. A client that sends its own
 * `totalPrice` is ignored, because the upstream stores the payload verbatim —
 * trusting it would let anyone buy at a price of their choosing.
 */
export const POST = createHandler({ body: orderInputSchema }, async ({ body, token }) => {
  const backend = getBackend();
  const { shippingCost, ...order } = body;

  // One lookup per distinct product, not per line.
  const ids = [...new Set(order.orderItems.map((item) => item.product))];
  const priced = await Promise.all(
    ids.map(async (id) => {
      const res = await backend.get<ApiEnvelope<Product>>(backendRoutes.products.byId(id));
      const price = Number(res?.data?.discountedPrice);
      if (!Number.isFinite(price) || price < 0) {
        throw new ApiError("Could not price one of the products in your cart", {
          status: 422,
          code: "VALIDATION_ERROR",
        });
      }
      return [id, price] as const;
    }),
  );
  const priceById = new Map(priced);

  const subtotal = order.orderItems.reduce(
    (sum, item) => sum + priceById.get(item.product)! * item.quantity,
    0,
  );
  const totalPrice = Number((subtotal + shippingCost).toFixed(2));

  return backend.post(
    backendRoutes.orders.create,
    { ...order, status: ORDER_STATUS.pending, totalPrice },
    { headers: authHeaders(token) },
  );
});
