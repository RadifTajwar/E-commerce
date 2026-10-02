import { createHandler } from "@/app/api/_lib/handler";
import { ApiError } from "@/lib/api/errors";
import { backendRoutes, getBackend } from "@/server/backend";
import { ratingInputSchema } from "@/validators/catalog";
import { idParam } from "@/validators/common";

/** GET /api/products/:id/ratings: reviews for a product (not cached: changes after every review). */
export const GET = createHandler({ params: idParam }, async ({ params }) =>
  getBackend().get(backendRoutes.products.ratings(params.id)),
);

/** POST /api/products/:id/ratings: submit a review. */
export const POST = createHandler(
  { params: idParam, body: ratingInputSchema.omit({ productId: true }).extend({ productId: ratingInputSchema.shape.productId.optional() }) },
  async ({ params, body }) => {
    if (body.productId && body.productId !== params.id) {
      throw new ApiError("productId does not match the route", { status: 400, code: "BAD_REQUEST" });
    }
    return getBackend().post(backendRoutes.products.createRating, { ...body, productId: params.id });
  },
);
