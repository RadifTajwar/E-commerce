"use client";

import { useEffect, type ReactNode } from "react";
import { Provider } from "react-redux";
import { InitialSessionProvider } from "@/hooks/session-context";
import store, { startCartPersistence } from "@/store";
import { fetchSession } from "@/store/slices/auth.slice";
import type { Session } from "@/types/user";

/**
 * Client-side providers for the whole app. Rendered by the server root layout.
 *
 * The session is resolved on the server from the auth cookie and passed down
 * through context — deliberately NOT dispatched into the store. The store is a
 * module singleton, so on the server it is shared by every concurrent request
 * and seeding it there would leak one visitor's session into another's markup.
 *
 * Context is per-render, so both the server HTML and the first client render
 * already know who is signed in. That closes the window in which every guard
 * saw "logged out" and bounced protected pages through the login screen.
 */
export default function Providers({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession: Session | null;
}) {
  useEffect(() => {
    startCartPersistence();
  }, []);

  // Revalidate when the tab regains focus, so a session that changed in
  // another tab (signed out, verified) is picked up.
  useEffect(() => {
    const onFocus = () => void store.dispatch(fetchSession());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return (
    <InitialSessionProvider value={initialSession}>
      <Provider store={store}>{children}</Provider>
    </InitialSessionProvider>
  );
}
