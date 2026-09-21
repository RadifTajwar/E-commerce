"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSession, logoutUser } from "@/store/slices/auth.slice";

/**
 * Current session from the server (via /api/auth/session), fetched once per
 * page load and shared through the store. Replaces reading and decoding the
 * JWT from localStorage in every component.
 */
export function useSession() {
  const dispatch = useAppDispatch();
  const { session, sessionStatus } = useAppSelector((state) => state.loginUser);

  useEffect(() => {
    if (sessionStatus === "idle") void dispatch(fetchSession());
  }, [dispatch, sessionStatus]);

  return {
    session,
    isLoggedIn: Boolean(session),
    isAdmin: session?.role === "admin",
    /** True until the first server check has completed. */
    isLoading: sessionStatus === "idle" || sessionStatus === "loading",
    logout: () => dispatch(logoutUser()).unwrap(),
    refresh: () => dispatch(fetchSession()).unwrap(),
  };
}
