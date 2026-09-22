"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MenuIcon } from "@/components/ui/icons";
import { ROUTES } from "@/config/constants";
import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/slices/auth.slice";
import { LogOutIcon } from "./icons";

export interface AdminTopBarProps {
  toggleSidebar: () => void;
}

export function AdminTopBar({ toggleSidebar }: AdminTopBarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogOut = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } finally {
      router.push(ROUTES.admin.login);
    }
  };

  return (
    <header className="sticky top-0 z-30 py-4 bg-white shadow-sm dark:bg-gray-800">
      <div className="max-w-4xl lg:max-w-7xl mx-auto flex items-center justify-between h-full px-6 mx-auto text-blue-500 dark:text-blue-500">
        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none"
          aria-label="Menu"
          type="button"
          onClick={toggleSidebar}
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <span />
        <ul className="flex justify-end items-center flex-shrink-0 space-x-6">
          <li className="relative inline-block text-left">
            <button
              className="rounded-full dark:bg-gray-500 bg-blue-500 text-white h-8 w-8 font-medium mx-auto focus:outline-none"
              type="button"
              aria-haspopup="true"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((open) => !open)}
            >
              <span>A</span>
            </button>
            {profileOpen && (
              <ul className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                <li
                  className="cursor-pointer justify-between font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-gray-100 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  onClick={handleLogOut}
                >
                  <span className="flex items-center text-sm">
                    <LogOutIcon className="w-4 h-4 mr-3" />
                    <span>Log Out</span>
                  </span>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}

export default AdminTopBar;
