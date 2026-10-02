import { NextResponse } from "next/server";
import { createHandler } from "@/app/api/_lib/handler";
import { ApiError } from "@/lib/api/errors";
import { authCookie, readClaims, claimsToSession } from "@/lib/auth";
import { backendRoutes, getBackend } from "@/server/backend";
import type { ApiEnvelope } from "@/types/api";
import type { LoginResult } from "@/types/user";
import { loginSchema } from "@/validators/auth";

/**
 * POST /api/auth/login
 * Forwards credentials to the backend, stores the returned JWT in an httpOnly
 * cookie and returns the session (never the token).
 */
export const POST = createHandler({ body: loginSchema, rateLimit: "auth" }, async ({ body, env, requestId }) => {
  const upstream = await getBackend().post<ApiEnvelope<LoginResult>>(backendRoutes.auth.login, body);
  const token = upstream?.data?.accessToken;
  if (!token) throw new ApiError("Login response did not include a token", { status: 502, code: "UPSTREAM_ERROR" });

  const claims = await readClaims(token, env.JWT_SECRET);
  const session = claimsToSession(claims);
  if (!session) throw new ApiError("Invalid token received from backend", { status: 502, code: "UPSTREAM_ERROR" });

  const res = NextResponse.json(
    { success: true, data: { session, user: upstream.data.user ?? null } },
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
});
