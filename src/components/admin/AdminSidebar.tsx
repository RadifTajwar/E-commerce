"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@/components/ui/icons";
import { ROUTES } from "@/config/constants";
import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/slices/auth.slice";
import { CatalogIcon, DashIcon, DashboardIcon, LogOutIcon, LogoIcon, OrdersIcon } from "./icons";
import { ADMIN_NAV, type NavChild, type NavEntry, type NavIconName } from "./nav-items";

export interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ICONS: Record<NavIconName, typeof DashboardIcon> = {
  dashboard: DashboardIcon,
  catalog: CatalogIcon,
  orders: OrdersIcon,
};

const GROUP_BUTTON =
  "inline-flex items-center justify-between focus:outline-none w-full text-sm font-semibold transition-colors duration-150 hover:text-blue-600 dark:hover:text-gray-200";
const CHILD_BUTTON =
  "flex items-center w-full font-serif py-2 text-sm text-gray-600 hover:text-blue-600 cursor-pointer";

function NavItem({ entry, isActive, onNavigate }: { entry: NavEntry & { kind: "link" }; isActive: boolean; onNavigate: (href: string) => void }) {
  const Icon = ICONS[entry.icon];
  return (
    <li className="relative">
      <button
        type="button"
        aria-current={isActive ? "page" : undefined}
        className={`cursor-pointer px-6 py-4 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 dark:hover:text-gray-200 hover:text-blue-600 ${
          isActive ? "bg-blue-500 text-white" : "text"
        } dark:text-gray-100`}
        onClick={() => onNavigate(entry.href)}
      >
        <Icon />
        <span className="ml-4">{entry.label}</span>
      </button>
    </li>
  );
}

function NavGroup({
  entry,
  isExpanded,
  onToggle,
  onNavigate,
}: {
  entry: NavEntry & { kind: "group" };
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: (href: string) => void;
}) {
  const Icon = ICONS[entry.icon];
  const renderChild = (child: NavChild) => {
    const content = (
      <>
        <span className="absolute inset-y-0 left-0 w-1 bg-blue-600 rounded-tr-lg rounded-br-lg" aria-hidden="true" />
        <span className="text-xs text-gray-500 pr-1">
          <DashIcon />
        </span>
        <span className="text-gray-500 hover:text-blue-600 dark:hover:text-gray-200">{child.label}</span>
      </>
    );

    return (
      <li key={child.label}>
        {child.href ? (
          <button type="button" className={CHILD_BUTTON} onClick={() => onNavigate(child.href as string)}>
            {content}
          </button>
        ) : (
          <div className={CHILD_BUTTON}>{content}</div>
        )}
      </li>
    );
  };

  return (
    <li className="relative px-6 py-3">
      <button className={GROUP_BUTTON} aria-haspopup="true" aria-expanded={isExpanded} onClick={onToggle}>
        <span className="inline-flex items-center">
          <Icon />
          <span className="ml-4 mt-1">{entry.label}</span>
          <span className="pl-4 mt-1">
            {isExpanded ? (
              <ChevronDownIcon className="h-[1em] w-[1em]" />
            ) : (
              <ChevronRightIcon className="h-[1em] w-[1em]" />
            )}
          </span>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="p-2 text-sm font-medium text-gray-500 rounded-md dark:text-gray-400 dark:bg-gray-900" aria-label="submenu">
          {entry.children.map(renderChild)}
        </ul>
      </div>
    </li>
  );
}

/** Admin navigation, driven by `nav-items.ts`. */
export function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathName = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const navigate = (href: string) => {
    router.push(href);
    // Leave the panel up for a moment so the tap is visible on small screens.
    setTimeout(() => setIsOpen(false), 500);
  };

  const handleLogOut = () => {
    dispatch(logoutUser())
      .unwrap()
      .finally(() => router.push(ROUTES.admin.login));
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}
    >
      <div className="py-4 text-gray-500 dark:text-gray-400 h-full">
        {/* Close Button for Smaller Screens */}
        <button
          type="button"
          className="lg:hidden absolute top-4 right-4 text-gray-600 dark:text-gray-300"
          aria-label="Close menu"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

        <div className=" text-gray-900 dark:text-gray-200" onClick={() => navigate(ROUTES.admin.dashboard)}>
          <div className="ml-5 flex font-bold">
            <LogoIcon />
            <h6 className="ml-2">Tithi Admin</h6>
          </div>
        </div>

        <ul className="mt-6">
          {ADMIN_NAV.map((entry) => {
            if (entry.kind === "link") {
              return (
                <NavItem key={entry.label} entry={entry} isActive={pathName === entry.href} onNavigate={navigate} />
              );
            }

            if (entry.kind === "group") {
              return (
                <NavGroup
                  key={entry.label}
                  entry={entry}
                  isExpanded={Boolean(expanded[entry.label])}
                  onToggle={() => setExpanded((prev) => ({ ...prev, [entry.label]: !prev[entry.label] }))}
                  onNavigate={navigate}
                />
              );
            }

            const Icon = ICONS[entry.icon];
            return (
              <li key={entry.label} className="relative px-6 py-3">
                <button type="button" className={GROUP_BUTTON} aria-haspopup="true">
                  <span className="inline-flex items-center">
                    <Icon />
                    <span className="ml-4 mt-1">{entry.label}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <span className="lg:fixed bottom-0 px-6 py-6 w-64 mx-auto relative mt-3 block">
          <button
            className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-5 py-3 rounded-lg text-white bg-blue-500 border border-transparent active:bg-blue-600 hover:bg-blue-600 focus:ring focus:ring-purple-300 w-full bg-blue-500 hover:bg-blue-700"
            type="button"
            onClick={handleLogOut}
          >
            <span className="flex items-center">
              <LogOutIcon className="mr-3 text-lg" />
              <span className="text-sm">Log Out</span>
            </span>
          </button>
        </span>
      </div>
    </div>
  );
}

export default AdminSidebar;
