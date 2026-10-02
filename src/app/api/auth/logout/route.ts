import { NextResponse } from "next/server";
import { createHandler } from "@/app/api/_lib/handler";
import { clearedAuthCookie } from "@/lib/auth";

/** POST /api/auth/logout: clears the session cookie. */
export const POST = createHandler({ rateLimit: "auth" }, async ({ env, requestId }) => {
  const res = NextResponse.json(
    { success: true, data: null },
    { headers: { "cache-control": "no-store", "x-request-id": requestId } },
  );
  res.cookies.set(clearedAuthCookie(env.AUTH_COOKIE_NAME, env.NODE_ENV === "production"));
  return res;
});
