"use client";

import { useEffect, type ReactNode } from "react";
import { Provider } from "react-redux";
import store, { startCartPersistence } from "@/store";
import { fetchSession } from "@/store/slices/auth.slice";

/**
 * Client-side providers for the whole app. Rendered by the server root layout.
 * - Redux store
 * - cart restore from localStorage after mount (avoids hydration mismatches)
 * - one session check per page load
 */
export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    startCartPersistence();
    void store.dispatch(fetchSession());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
