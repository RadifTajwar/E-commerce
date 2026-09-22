"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";
import { useClickOutside } from "@/hooks/useClickOutside";
import type { Category } from "@/types";

export interface CategoryDropdownProps {
  categories: Category[];
  /** The selected category's display name. */
  value: string;
  onSelect: (categoryName: string) => void;
}

export function CategoryDropdown({ categories, value, onSelect }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setIsOpen(false), []);
  useClickOutside(containerRef, close, isOpen);

  return (
    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 col-span-6 sm:col-span-2">
        Category
      </label>
      <div className="col-span-6 sm:col-span-4">
        <div className="relative" ref={containerRef}>
          <div
            className="parentCategory flex items-center justify-between px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer dark:bg-gray-700 dark:border-gray-600"
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
            <span className="text-gray-500 dark:text-gray-300">
              <ChevronDownIcon className="h-4 w-4" />
            </span>
          </div>

          {isOpen ? (
            <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md dark:bg-gray-700 dark:border-gray-600 max-h-40 overflow-y-auto">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id}>
                    <a
                      className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={() => {
                        onSelect(category.name);
                        setIsOpen(false);
                      }}
                    >
                      {category.name}
                    </a>
                  </li>
                ))
              ) : (
                <li>
                  <a className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    No Categories Available
                  </a>
                </li>
              )}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default CategoryDropdown;
