import { createHandler } from "@/app/api/_lib/handler";
import { backendRoutes, getBackend } from "@/server/backend";
import { forgotPasswordSchema } from "@/validators/auth";

/**
 * POST /api/users/forgot-password: mail a reset code.
 * Rate limited as an auth route. The upstream answers identically whether or
 * not the address is registered, so this cannot enumerate accounts.
 */
export const POST = createHandler(
  { body: forgotPasswordSchema, rateLimit: "auth" },
  async ({ body }) => getBackend().post(backendRoutes.users.forgotPassword, body),
);
