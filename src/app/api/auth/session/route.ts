import { createHandler } from "@/app/api/_lib/handler";

/** GET /api/auth/session: the current session or null. Never exposes the token. */
export const GET = createHandler({ rateLimit: "public" }, async ({ session }) => ({
  success: true,
  data: session,
}));
