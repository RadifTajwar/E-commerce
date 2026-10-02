"use client";

import { createContext, useContext } from "react";
import type { Session } from "@/types/user";

/**
 * The session resolved on the server for this request.
 *
 * Kept in its own leaf module rather than beside the provider component: every
 * component that reads the session imports this, and pointing them all at the
 * providers module would drag the whole store graph along with it.
 */
const InitialSessionContext = createContext<Session | null>(null);

export const InitialSessionProvider = InitialSessionContext.Provider;

export function useInitialSession(): Session | null {
  return useContext(InitialSessionContext);
}
