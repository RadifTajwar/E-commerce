import { THEME_STORAGE_KEY } from "@/config/theme";

/**
 * Applies the saved theme before the first paint, but only under /admin.
 *
 * Two constraints meet here. It has to be a blocking inline script, because
 * deciding the theme in an effect runs after React has painted and a dark-mode
 * admin would see a white flash on every load. And it has to be path-scoped,
 * because the storefront carries its own `dark:` variants and would otherwise
 * go dark along with the dashboard.
 *
 * AdminThemeScope handles the other half: adding and removing the class across
 * client-side navigation, which this script never sees.
 */
export default function ThemeScript() {
  const script = `
try {
  if (location.pathname.indexOf("/admin") === 0) {
    var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var dark = stored ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (dark) document.documentElement.classList.add("dark");
  }
} catch (e) {}
`.trim();

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
