"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MenuIcon } from "@/components/ui/icons";
import { ROUTES } from "@/config/constants";
import { useSession } from "@/hooks/useSession";
import { useLogout } from "@/hooks/useLogout";
import { LogOutIcon } from "./icons";
import ThemeToggle from "./ThemeToggle";

export interface AdminTopBarProps {
  toggleSidebar: () => void;
}

/** Path → the title shown in the bar, so every screen names itself. */
const TITLES: [string, string][] = [
  [ROUTES.admin.dashboard, "Dashboard"],
  [ROUTES.admin.products, "Products"],
  [ROUTES.admin.categories, "Categories"],
  [ROUTES.admin.parentCategories, "Parent categories"],
  [ROUTES.admin.orders, "Orders"],
  ["/admin/orderNo", "Order details"],
  [ROUTES.admin.heroBanner, "Hero banner"],
  [ROUTES.admin.video, "Video banner"],
  [ROUTES.admin.settings, "Settings"],
];

function titleFor(pathname: string): string {
  const hit = TITLES.find(([href]) => pathname.startsWith(href));
  return hit ? hit[1] : "Admin";
}

export function AdminTopBar({ toggleSidebar }: AdminTopBarProps) {
  const pathname = usePathname();
  const { session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);

  // Close the profile menu on an outside click or Escape.
  useEffect(() => {
    if (!profileOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setProfileOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setProfileOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  const handleLogOut = useLogout(ROUTES.admin.login);

  const email = session?.email ?? "";
  const initial = (email[0] ?? "A").toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 dark:border-slate-800 dark:bg-slate-900/90">
      <button
        type="button"
        aria-label="Open menu"
        onClick={toggleSidebar}
        className="-ml-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      <h1 className="text-[15px] font-semibold text-slate-900 dark:text-white">
        {titleFor(pathname)}
      </h1>

      <ul className="ml-auto flex items-center gap-1">
        <li>
          <ThemeToggle />
        </li>
        <li className="relative" ref={menuRef}>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-slate-900"
          >
            {initial}
          </button>

          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <p className="text-[11px] uppercase tracking-wider text-slate-400">Signed in as</p>
                <p className="mt-0.5 truncate text-sm font-medium text-slate-900 dark:text-white">
                  {email || "Administrator"}
                </p>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogOut}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              >
                <LogOutIcon className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </li>
      </ul>
    </header>
  );
}

export default AdminTopBar;
