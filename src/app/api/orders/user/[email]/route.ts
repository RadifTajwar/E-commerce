import { createHandler } from "@/app/api/_lib/handler";
import { ApiError } from "@/lib/api/errors";
import { authHeaders, backendRoutes, getBackend } from "@/server/backend";
import { emailParam } from "@/validators/common";

/** GET /api/orders/user/:email: a user's orders. Users may only read their own. */
export const GET = createHandler({ params: emailParam, auth: "user" }, async ({ params, session, token }) => {
  if (session!.role !== "admin" && session!.email.toLowerCase() !== params.email.toLowerCase()) {
    throw new ApiError("You can only view your own orders", { status: 403, code: "FORBIDDEN" });
  }
  return getBackend().get(backendRoutes.orders.byUser(params.email), { headers: authHeaders(token) });
});
