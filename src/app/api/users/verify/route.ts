import { NextResponse } from "next/server";
import { createHandler } from "@/app/api/_lib/handler";
import { ApiError } from "@/lib/api/errors";
import { authCookie, claimsToSession, readClaims } from "@/lib/auth";
import { authHeaders, backendRoutes, getBackend } from "@/server/backend";
import type { ApiEnvelope } from "@/types/api";
import type { User } from "@/types/user";
import { verifyEmailSchema } from "@/validators/auth";

interface VerifyResult {
  user: User;
  accessToken: string;
}

/**
 * POST /api/users/verify — exchange the 6-digit code for a verified account.
 *
 * Requires a session and refuses a code belonging to someone else: a 6-digit
 * space is small enough to grind through otherwise. On success the session
 * cookie is replaced with a token carrying the new isVerified, so the prompt
 * clears immediately instead of lingering until the old token expires.
 */
export const POST = createHandler(
  { body: verifyEmailSchema, auth: "user", rateLimit: "auth" },
  async ({ body, session, env, requestId, token: sessionToken }) => {
    // The backend checks the code against this session's account only.
    const upstream = await getBackend().post<ApiEnvelope<VerifyResult>>(
      backendRoutes.users.verify,
      body,
      { headers: authHeaders(sessionToken) },
    );

    const verified = upstream?.data?.user;
    const token = upstream?.data?.accessToken;
    if (!verified || !token) {
      throw new ApiError("Verification response was incomplete", {
        status: 502,
        code: "UPSTREAM_ERROR",
      });
    }

    if (verified.email?.toLowerCase() !== session!.email.toLowerCase()) {
      throw new ApiError("That code belongs to a different account", {
        status: 403,
        code: "FORBIDDEN",
      });
    }

    const claims = await readClaims(token, env.JWT_SECRET);
    const res = NextResponse.json(
      { success: true, data: { session: claimsToSession(claims) } },
      { headers: { "cache-control": "no-store", "x-request-id": requestId } },
    );
    res.cookies.set(
      authCookie({
        name: env.AUTH_COOKIE_NAME,
        token,
        expiresAtSeconds: typeof claims?.exp === "number" ? claims.exp : undefined,
        secure: env.NODE_ENV === "production",
      }),
    );
    return res;
  },
);
