"use client";

import { useEffect } from "react";
import { THEME_STORAGE_KEY } from "@/config/theme";

/**
 * Confines dark mode to the admin area.
 *
 * Tailwind reads `dark` from <html>, which is global — so without this the
 * storefront's own `dark:` variants fire too and the shop goes dark with the
 * dashboard. Mounted only inside the admin layout: the class goes on while
 * admin is on screen and comes off when the user navigates back to the shop.
 */
export default function AdminThemeScope() {
  useEffect(() => {
    const root = document.documentElement;
    let dark = false;
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      dark = stored
        ? stored === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      // Blocked storage: fall back to light.
    }
    root.classList.toggle("dark", dark);

    return () => root.classList.remove("dark");
  }, []);

  return null;
}
