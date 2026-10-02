import { createHandler } from "@/app/api/_lib/handler";
import { withLiveVerification } from "@/server/session";

/** GET /api/auth/session: the current session or null. Never exposes the token. */
export const GET = createHandler({ rateLimit: "public" }, async ({ session, token }) => ({
  success: true,
  data: session ? await withLiveVerification(session, token) : null,
}));
