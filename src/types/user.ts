export type UserRole = "admin" | "user" | string;

export interface User {
  _id?: string;
  id?: string;
  name?: string;
  email: string;
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

/** What the backend returns from /auth/login (inside `data`). */
export interface LoginResult {
  accessToken: string;
  user?: User;
}

/** Claims found in the backend JWT. */
export interface JwtClaims {
  email?: string;
  role?: UserRole;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/** What the browser is told about the current session. Never includes the token. */
export interface Session {
  email: string;
  role: UserRole;
  expiresAt?: number;
}
