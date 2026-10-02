import { createHandler } from "@/app/api/_lib/handler";
import { backendRoutes, getBackend } from "@/server/backend";
import { resendVerificationSchema } from "@/validators/auth";

/**
 * POST /api/users/resend-verification: issue a fresh code.
 * Rate limited as an auth route; the upstream answers identically whether or
 * not the address is registered, so this cannot enumerate accounts.
 */
export const POST = createHandler(
  { body: resendVerificationSchema, rateLimit: "auth" },
  async ({ body }) => getBackend().post(backendRoutes.users.resendVerification, body),
);
