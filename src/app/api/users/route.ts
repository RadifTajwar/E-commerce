import { createHandler } from "@/app/api/_lib/handler";
import { backendRoutes, getBackend } from "@/server/backend";
import { registerSchema } from "@/validators/auth";

/** POST /api/users: register a new user. */
export const POST = createHandler({ body: registerSchema, rateLimit: "auth" }, async ({ body }) =>
  getBackend().post(backendRoutes.users.create, body),
);
