import "server-only";
import { getServerEnv } from "@/config/env";
import { sessionFromToken } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { authHeaders, backendRoutes, getBackend } from "@/server/backend";
import type { ApiEnvelope } from "@/types/api";
import type { Session, User } from "@/types/user";

/**
 * Resolving the current session on the server, shared by the root layout and
 * /api/auth/session so both agree on the very first paint. If they disagreed,
 * the client would correct itself a moment after hydration and the UI would
 * visibly flip.
 */

/**
 * `isVerified` is baked into the token at login, so a customer who verifies
 * afterwards keeps a token that says otherwise until it expires.
 *
 * Only a token claiming *unverified* is worth re-checking: it cannot go stale
 * in the other direction, so the common case costs nothing.
 */
export async function withLiveVerification(
  session: Session,
  token: string | undefined,
): Promise<Session> {
  if (session.isVerified !== false) return session;

  try {
    const res = await getBackend().get<ApiEnvelope<User & { isVerified?: boolean }>>(
      backendRoutes.users.byEmail(session.email),
      { headers: authHeaders(token) },
    );
    const live = res?.data?.isVerified;
    if (typeof live === "boolean" && live !== session.isVerified) {
      return { ...session, isVerified: live };
    }
  } catch (err) {
    logger.warn({ err }, "could not refresh verification state; using the token's claim");
  }
  return session;
}

/**
 * The session for a request, read from the auth cookie. `cookieValue` is passed
 * in rather than read here so this stays usable from both route handlers and
 * server components.
 */
export async function resolveSession(cookieValue: string | undefined): Promise<Session | null> {
  const env = getServerEnv();
  const session = await sessionFromToken(cookieValue, env.JWT_SECRET);
  if (!session) return null;
  return withLiveVerification(session, cookieValue);
}
