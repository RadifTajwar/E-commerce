"use client";

import { useCallback, useEffect, useState } from "react";

import { THEME_STORAGE_KEY, type Theme } from "@/config/theme";

export type { Theme };

/**
 * Light/dark for the admin area, persisted per browser.
 *
 * The class is put on <html> by an inline script before paint (see
 * ThemeScript), so this hook only has to read back what is already applied and
 * keep it in sync — it never decides the theme on mount, which would flash.
 */
export function useTheme(): { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void } {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    setThemeState(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode or blocked storage: the choice just will not persist.
    }
    setThemeState(next);
  }, []);

  const toggle = useCallback(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
  }, [setTheme]);

  return { theme, toggle, setTheme };
}
