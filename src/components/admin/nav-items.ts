import { ROUTES } from "@/config/constants";

export type NavIconName = "dashboard" | "catalog" | "orders";

export interface NavChild {
  label: string;
  /** Omitted for entries that have no screen yet (e.g. Coupon). */
  href?: string;
}

export type NavEntry =
  | { kind: "link"; label: string; icon: NavIconName; href: string }
  | { kind: "group"; label: string; icon: NavIconName; children: NavChild[] }
  | { kind: "heading"; label: string; icon: NavIconName };

/**
 * The admin sidebar, as data. Previously 626 lines of copy-pasted markup.
 * "Customers" and "Main Banner" are gone: neither has a screen any more.
 */
export const ADMIN_NAV: NavEntry[] = [
  { kind: "link", label: "Dashboard", icon: "dashboard", href: ROUTES.admin.dashboard },
  {
    kind: "group",
    label: "Catalog",
    icon: "catalog",
    children: [
      { label: "Products", href: ROUTES.admin.products },
      { label: "Categories", href: ROUTES.admin.categories },
      { label: "Parent Categories", href: ROUTES.admin.parentCategories },
      { label: "Coupon" },
    ],
  },
  {
    kind: "group",
    label: "Banners",
    icon: "catalog",
    children: [
      { label: "Video", href: ROUTES.admin.video },
      { label: "Hero Banner", href: ROUTES.admin.heroBanner },
    ],
  },
  { kind: "link", label: "Orders", icon: "orders", href: ROUTES.admin.orders },
  { kind: "heading", label: "Page", icon: "catalog" },
];
