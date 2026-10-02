"use client";

import { useCallback, useRef, useState } from "react";
import { Field } from "@/components/admin/ui";
import { ChevronDownIcon } from "@/components/ui/icons";
import { useClickOutside } from "@/hooks/useClickOutside";
import type { Category } from "@/types";

export interface CategoryDropdownProps {
  categories: Category[];
  /** Keeps the id unique while both product drawers are mounted. */
  idPrefix: string;
  /** The selected category's display name. */
  value: string;
  onSelect: (categoryName: string) => void;
}

export function CategoryDropdown({ categories, value, onSelect, idPrefix }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setIsOpen(false), []);
  useClickOutside(containerRef, close, isOpen);

  return (
    <Field label="Category" htmlFor={`product-category-${idPrefix}`}>
      <div className="relative" ref={containerRef}>
        <button
          id={`product-category-${idPrefix}`}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:border-slate-600"
        >
          <span className={value ? "" : "text-slate-400"}>{value || "Select a category"}</span>
          <ChevronDownIcon
            className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <ul
            role="listbox"
            className="absolute z-20 mt-2 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
          >
            {categories.length > 0 ? (
              categories.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={category.name === value}
                    onClick={() => {
                      onSelect(category.name);
                      setIsOpen(false);
                    }}
                    className={`block w-full px-3.5 py-2 text-left text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${
                      category.name === value
                        ? "font-medium text-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3.5 py-2 text-sm text-slate-400">No categories available</li>
            )}
          </ul>
        )}
      </div>
    </Field>
  );
}

export default CategoryDropdown;
