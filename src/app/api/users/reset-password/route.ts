import { createHandler } from "@/app/api/_lib/handler";
import { backendRoutes, getBackend } from "@/server/backend";
import { resetPasswordSchema } from "@/validators/auth";

/** POST /api/users/reset-password: exchange a valid code for a new password. */
export const POST = createHandler(
  { body: resetPasswordSchema, rateLimit: "auth" },
  async ({ body }) => getBackend().post(backendRoutes.users.resetPassword, body),
);
