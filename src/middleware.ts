import { NextResponse, type NextRequest } from "next/server";
import { getServerEnv } from "@/config/env";
import { ROUTES } from "@/config/constants";
import { sessionFromToken } from "@/lib/auth";

/**
 * Cross-cutting concerns (edge runtime, so no Node-only imports):
 *  - request id on every request/response
 *  - CORS for /api/* using ALLOWED_ORIGINS (same-origin always allowed)
 *  - auth guard for /admin/* (admin role) and /myAccount/* (any session),
 *    redirecting to the same pages the old client-side effects used
 */

const CORS_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";
const CORS_HEADERS = "Content-Type,Authorization,X-Request-Id";

function corsHeaders(origin: string): Record<string, string> {
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": CORS_METHODS,
    "access-control-allow-headers": CORS_HEADERS,
    "access-control-allow-credentials": "true",
    "access-control-max-age": "600",
    vary: "Origin",
  };
}

export async function middleware(req: NextRequest) {
  const env = getServerEnv();
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();
  const { pathname } = req.nextUrl;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-request-id", requestId);

  // ---- /api: CORS -----------------------------------------------------------
  if (pathname.startsWith("/api/")) {
    const origin = req.headers.get("origin");
    const sameOrigin = !origin || origin === req.nextUrl.origin;
    const allowed = sameOrigin || env.ALLOWED_ORIGINS.includes(origin);

    if (req.method === "OPTIONS") {
      if (!allowed) return new NextResponse(null, { status: 403 });
      return new NextResponse(null, { status: 204, headers: origin ? corsHeaders(origin) : {} });
    }
    if (!allowed) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Origin not allowed", requestId } },
        { status: 403, headers: { "x-request-id": requestId } },
      );
    }
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    res.headers.set("x-request-id", requestId);
    if (origin && !sameOrigin) for (const [k, v] of Object.entries(corsHeaders(origin))) res.headers.set(k, v);
    return res;
  }

  // ---- Protected pages ------------------------------------------------------
  const isAdminArea = pathname.startsWith("/admin/");
  const isAccountArea = pathname === "/myAccount" || pathname.startsWith("/myAccount/");

  if (isAdminArea || isAccountArea) {
    const token = req.cookies.get(env.AUTH_COOKIE_NAME)?.value;
    const session = await sessionFromToken(token, env.JWT_SECRET);
    const ok = session && (!isAdminArea || session.role === "admin");
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = isAdminArea ? ROUTES.admin.login : ROUTES.login;
      url.search = "";
      const res = NextResponse.redirect(url);
      res.headers.set("x-request-id", requestId);
      return res;
    }
  }

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("x-request-id", requestId);
  return res;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/myAccount",
    "/myAccount/:path*",
  ],
};
