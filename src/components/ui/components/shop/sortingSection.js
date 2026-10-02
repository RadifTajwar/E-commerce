"use client";

import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const SORT_LABELS = {
  default: "Default Sorting",
  asc: "Sort By Price: Low To High",
  desc: "Sort By Price: High To Low",
};

/** Sort facet. The chosen order lives in `?orderby=`, nothing else. */
export default function SortingSection() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedOrder = SORT_LABELS[searchParams.get("orderby")] ?? SORT_LABELS.default;

  const dropDown = () => {
    setIsOpen(!isOpen);
  };

  const handleSort = (orderby) => {
    const params = new URLSearchParams(window.location.search);
    params.set("orderby", orderby);
    // Manually construct the final URL to prevent unwanted encoding
    const newUrl = `${window.location.pathname}?${params.toString().replace(/%2C/g, ",")}`;

    router.push(newUrl, { scroll: false });
    setIsOpen(false);
  };

  return (
    <div className="relative md:min-w-[220px]">
      <button
        id="dropdownDividerButton"
        className="border-b border-gray-800 text-white focus:outline-none font-medium text-sm inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex justify-between my-3 w-full hidden md:flex"
        type="button"
        onClick={dropDown}
        aria-expanded={isOpen}
      >
        <p className="text-sm text-black decoration-gray-800 font-semibold">{selectedOrder}</p>
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
            className="text-black"
          />
        </svg>
      </button>
      <button
        className="md:border-b md:border-gray-800 text-white focus:outline-none font-medium text-sm inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex justify-between my-3 w-full md:hidden"
        type="button"
        onClick={dropDown}
        aria-expanded={isOpen}
      >
        <p className="text-sm text-black decoration-gray-800 font-semibold">
          <SwapVertIcon />
        </p>
      </button>

      {isOpen && (
        <div
          id="dropdownDivider"
          className="min-w-[220px] z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 absolute -left-48 md:left-0"
        >
          <ul className="w-full text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDividerButton">
            <li className="w-full">
              <a
                onClick={() => handleSort("default")}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-xs md:text-sm cursor-pointer"
              >
                Default Sorting
              </a>
            </li>
            <li>
              <a
                onClick={() => handleSort("asc")}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-xs md:text-sm cursor-pointer"
              >
                Sort By Price: Low To High
              </a>
            </li>
            <li>
              <a
                onClick={() => handleSort("desc")}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-xs md:text-sm cursor-pointer"
              >
                Sort By Price: High To Low
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
