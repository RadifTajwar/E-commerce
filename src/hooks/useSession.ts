"use client";

import { useInitialSession } from "@/hooks/session-context";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSession, logoutUser } from "@/store/slices/auth.slice";

/**
 * Current session, seeded on the server from the auth cookie in Providers and
 * shared through the store. It is known on the first render, so consumers never
 * have to render a "logged out" state while waiting to find out.
 */
export function useSession() {
  const dispatch = useAppDispatch();
  const initialSession = useInitialSession();
  const { session: storedSession, sessionStatus } = useAppSelector((state) => state.loginUser);

  // Until something in this tab changes the session (login, logout, refresh),
  // the server-resolved value is the truth — and it is available immediately.
  const session = sessionStatus === "idle" ? initialSession : storedSession;

  return {
    session,
    isLoggedIn: Boolean(session),
    isAdmin: session?.role === "admin",
    /** False only when the token explicitly says the address is unverified. */
    needsEmailVerification: Boolean(session) && session?.isVerified === false,
    /**
     * The session is known from the first render, so nothing ever has to wait
     * to find out. Kept for callers that still branch on it.
     */
    isLoading: false,
    logout: () => dispatch(logoutUser()).unwrap(),
    refresh: () => dispatch(fetchSession()).unwrap(),
  };
}
