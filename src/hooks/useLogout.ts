"use client";

import { useCallback } from "react";
import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/slices/auth.slice";

/**
 * Sign out and leave via a full page load.
 *
 * `router.push` after a logout is not enough: the App Router keeps RSC payloads
 * for already-visited routes in an in-memory cache, so pressing Back — or
 * following a link to a page seen while signed in — re-renders it from that
 * cache without ever reaching middleware. A hard navigation drops the router
 * cache, the Redux store and every other scrap of client state along with it.
 *
 * The cookie clearing still has to finish first, which is why this awaits the
 * request before navigating, and navigates anyway if it fails.
 */
export function useLogout(destination: string) {
  const dispatch = useAppDispatch();

  return useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch {
      // The cookie may already be gone; leaving is still the right outcome.
    } finally {
      window.location.assign(destination);
    }
  }, [dispatch, destination]);
}
