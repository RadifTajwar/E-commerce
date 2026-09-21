"use client";
import localStorageUtil from "@/utils/localStorageUtil";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function topBar({ toggleSidebar }) {
  const router = useRouter();
  const pathName = usePathname();
  const [notificationBarClicked, setNotificationBarClicked] = useState(false);
  const [profileClicked, setProfileClicked] = useState(false);
  const handleLogOut = () => {
    localStorageUtil.removeItem("accessToken");
    router.push("/admin");
  };
  return (
    <>
      <header className="sticky top-0 z-30 py-4 bg-white shadow-sm dark:bg-gray-800">
        <div className="max-w-4xl lg:max-w-7xl mx-auto flex items-center justify-between h-full px-6 mx-auto text-blue-500 dark:text-blue-500">
          <button
            className="radif p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none"
            aria-label="Menu"
            onClick={toggleSidebar}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="w-6 h-6"
              aria-hidden="true"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="48"
                d="M88 152h336M88 256h336M88 360h336"
              ></path>
            </svg>
          </button>
          <span></span>
          <ul className="flex justify-end items-center flex-shrink-0 space-x-6">
            <li className="relative inline-block text-left">
              <button
                className="rounded-full dark:bg-gray-500 bg-blue-500 text-white h-8 w-8 font-medium mx-auto focus:outline-none"
                onClick={() => {
                  setProfileClicked(!profileClicked);
                  setNotificationBarClicked(false);
                }}
              >
                <span>A</span>
              </button>
              {profileClicked && (
                <>
                  <ul className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <li
                      className="cursor-pointer justify-between font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-gray-100 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                      onClick={handleLogOut}
                    >
                      <span className="flex items-center text-sm">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 512 512"
                          className="w-4 h-4 mr-3"
                          aria-hidden="true"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="32"
                            d="M304 336v40a40 40 0 01-40 40H104a40 40 0 01-40-40V136a40 40 0 0140-40h152c22.09 0 48 17.91 48 40v40m64 160l80-80-80-80m-192 80h256"
                          ></path>
                        </svg>
                        <span>Log Out</span>
                      </span>
                    </li>
                  </ul>
                </>
              )}
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}
