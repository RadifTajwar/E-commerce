/**
 * Plain module on purpose: ThemeScript is a Server Component and imports this.
 * Importing the key from the "use client" hook handed back a client reference
 * proxy instead of the string, and the inline script rendered
 * `localStorage.getItem({})`.
 */
export const THEME_STORAGE_KEY = "tithi:admin-theme";

export type Theme = "light" | "dark";
