"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";
import { ROUTES } from "@/config/constants";
import { clientEnv } from "@/config/env";
import { useLogout } from "@/hooks/useLogout";
import { CatalogIcon, DashboardIcon, LogOutIcon, LogoIcon, OrdersIcon } from "./icons";
import { ADMIN_NAV, type NavEntry, type NavIconName } from "./nav-items";

export interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ICONS: Record<NavIconName, typeof DashboardIcon> = {
  dashboard: DashboardIcon,
  catalog: CatalogIcon,
  orders: OrdersIcon,
};

/** A group counts as open when one of its children is the current page. */
function groupHoldsPath(entry: NavEntry, pathname: string): boolean {
  return (
    entry.kind === "group" &&
    entry.children.some((child) => child.href && pathname.startsWith(child.href))
  );
}

export function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Groups start expanded when they contain the current page, so the sidebar
  // always shows where you are without a click.
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      ADMIN_NAV.filter((e) => e.kind === "group").map((e) => [
        e.label,
        groupHoldsPath(e, pathname),
      ]),
    ),
  );

  useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev };
      for (const entry of ADMIN_NAV) {
        if (entry.kind === "group" && groupHoldsPath(entry, pathname)) next[entry.label] = true;
      }
      return next;
    });
  }, [pathname]);

  const go = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  const handleLogOut = useLogout(ROUTES.admin.login);

  const isCurrent = (href: string) =>
    href === ROUTES.admin.dashboard ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-slate-200 px-5 dark:border-slate-800">
        <LogoIcon className="h-5 w-5 text-slate-900 dark:text-white" />
        <span className="truncate text-[15px] font-semibold tracking-tight text-slate-900 dark:text-white">
          {clientEnv.NEXT_PUBLIC_APP_NAME}
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {ADMIN_NAV.map((entry) => {
            const Icon = ICONS[entry.icon];

            if (entry.kind === "link") {
              const active = isCurrent(entry.href);
              return (
                <li key={entry.label}>
                  <button
                    type="button"
                    aria-current={active ? "page" : undefined}
                    onClick={() => go(entry.href)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {entry.label}
                  </button>
                </li>
              );
            }

            if (entry.kind === "heading") {
              return (
                <li key={entry.label} className="px-3 pb-1 pt-5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {entry.label}
                  </span>
                </li>
              );
            }

            const open = expanded[entry.label];
            return (
              <li key={entry.label}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setExpanded((p) => ({ ...p, [entry.label]: !p[entry.label] }))}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <Icon className="h-[18px] w-[18px]" />
                  <span className="flex-1 text-left">{entry.label}</span>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>

                {open && (
                  <ul className="mb-1 ml-[22px] mt-0.5 space-y-0.5 border-l border-slate-200 pl-3 dark:border-slate-800">
                    {entry.children.map((child) => {
                      const active = Boolean(child.href && isCurrent(child.href));
                      return (
                        <li key={child.label}>
                          <button
                            type="button"
                            disabled={!child.href}
                            aria-current={active ? "page" : undefined}
                            onClick={() => child.href && go(child.href)}
                            className={`w-full rounded-md px-3 py-2 text-left text-[13px] transition-colors ${
                              active
                                ? "bg-slate-100 font-medium text-slate-900 dark:bg-slate-800 dark:text-white"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white"
                            } disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent`}
                          >
                            {child.label}
                            {!child.href && (
                              <span className="ml-2 text-[10px] uppercase tracking-wide text-slate-400">
                                soon
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-slate-200 p-3 dark:border-slate-800">
        <button
          type="button"
          onClick={handleLogOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
        >
          <LogOutIcon className="h-[18px] w-[18px]" />
          Log out
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
