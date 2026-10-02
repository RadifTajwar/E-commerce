import { createHandler } from "@/app/api/_lib/handler";
import { ApiError } from "@/lib/api/errors";
import { authHeaders, backendRoutes, getBackend } from "@/server/backend";
import type { ApiEnvelope } from "@/types/api";
import type { Session, User } from "@/types/user";
import { profileUpdateSchema } from "@/validators/auth";

/**
 * The signed-in customer's own profile.
 *
 * The upstream addresses users by id and has no auth of its own, so the id is
 * always taken from the session — never from the request — and the record that
 * comes back is checked to belong to the caller before it is returned.
 */

/** Only these ever reach the browser; the upstream document also holds the hash. */
function publicProfile(user: User & Record<string, unknown>) {
  return {
    id: user.id ?? user._id,
    name: user.name ?? "",
    email: user.email ?? "",
    phone: (user.phone as string) ?? "",
    shippingAddress: (user.shippingAddress as string) ?? "",
    location: (user.location as string) ?? "",
  };
}

async function loadOwnProfile(session: Session, token: string | undefined) {
  // Tokens issued before the `id` claim existed still have to work, so fall
  // back to the address — which is the identity the session is trusted for
  // either way. Both paths re-check the record belongs to the caller.
  const path = session.id
    ? backendRoutes.users.byId(session.id)
    : backendRoutes.users.byEmail(session.email);

  const res = await getBackend().get<ApiEnvelope<User>>(path, { headers: authHeaders(token) });
  const user = res?.data;
  if (!user || user.email?.toLowerCase() !== session.email.toLowerCase()) {
    throw new ApiError("Profile not found", { status: 404, code: "NOT_FOUND" });
  }
  return user;
}

/** The upstream addresses updates by id, which older sessions do not carry. */
function requireId(user: User & Record<string, unknown>): string {
  const id = (user.id ?? user._id) as string | undefined;
  if (!id) {
    throw new ApiError("Please sign in again to update your details", {
      status: 401,
      code: "UNAUTHORIZED",
    });
  }
  return String(id);
}

/** GET /api/users/me */
export const GET = createHandler({ auth: "user" }, async ({ session, token }) => {
  const user = await loadOwnProfile(session!, token);
  return { success: true, data: publicProfile(user as never) };
});

/** PATCH /api/users/me: name, phone and address only. */
export const PATCH = createHandler(
  { body: profileUpdateSchema, auth: "user", rateLimit: "write" },
  async ({ body, session, token }) => {
    // Confirms the record still belongs to the caller before writing to it.
    const current = await loadOwnProfile(session!, token);

    await getBackend().patch<ApiEnvelope<User>>(
      backendRoutes.users.update(requireId(current as never)),
      body,
      { headers: authHeaders(token) },
    );

    // Re-read: the upstream's update response omits the select:0 fields, which
    // would look to the caller like phone and address had been cleared.
    const saved = await loadOwnProfile(session!, token);
    return { success: true, data: publicProfile(saved as never) };
  },
);
