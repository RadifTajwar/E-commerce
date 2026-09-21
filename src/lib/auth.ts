import { decodeJwt } from "jose/jwt/decode";
import { jwtVerify } from "jose/jwt/verify";
import type { JwtClaims, Session } from "@/types/user";

/**
 * JWT helpers shared by middleware (edge) and route handlers.
 * No Node-only imports here.
 *
 * If JWT_SECRET is configured the signature is verified; otherwise the token
 * is decoded and its expiry checked (the backend remains the authority).
 */

export async function readClaims(token: string, secret?: string): Promise<JwtClaims | null> {
  try {
    if (secret) {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
      return payload as JwtClaims;
    }
    return decodeJwt(token) as JwtClaims;
  } catch {
    return null;
  }
}

export function isExpired(claims: JwtClaims, nowSeconds = Math.floor(Date.now() / 1000)): boolean {
  return typeof claims.exp === "number" && claims.exp <= nowSeconds;
}

export function claimsToSession(claims: JwtClaims | null): Session | null {
  if (!claims || typeof claims.email !== "string" || !claims.email) return null;
  if (isExpired(claims)) return null;
  return {
    email: claims.email,
    role: typeof claims.role === "string" ? claims.role : "user",
    ...(typeof claims.exp === "number" ? { expiresAt: claims.exp * 1000 } : {}),
  };
}

export async function sessionFromToken(token: string | undefined, secret?: string): Promise<Session | null> {
  if (!token) return null;
  return claimsToSession(await readClaims(token, secret));
}

export interface AuthCookieOptions {
  name: string;
  token: string;
  /** Unix seconds; falls back to 7 days. */
  expiresAtSeconds?: number;
  secure: boolean;
}

/** Cookie attributes for the session cookie (httpOnly, SameSite=Lax). */
export function authCookie(opts: AuthCookieOptions) {
  const maxAge = opts.expiresAtSeconds
    ? Math.max(0, opts.expiresAtSeconds - Math.floor(Date.now() / 1000))
    : 60 * 60 * 24 * 7;
  return {
    name: opts.name,
    value: opts.token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: opts.secure,
    path: "/",
    maxAge,
  };
}

export function clearedAuthCookie(name: string, secure: boolean) {
  return { name, value: "", httpOnly: true, sameSite: "lax" as const, secure, path: "/", maxAge: 0 };
}
