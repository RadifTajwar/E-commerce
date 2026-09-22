"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

export interface SearchCategoryOption {
  id: string;
  name: string;
}

export interface SortOption {
  value: string;
  label: string;
}

/** Price sorting the admin product list offers; values match the shop pages. */
export const PRICE_SORT_OPTIONS: SortOption[] = [
  { value: "asc", label: "Low to High" },
  { value: "desc", label: "High to Low" },
];

export interface SearchFormProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Provide to render the category dropdown (product list only). */
  categories?: SearchCategoryOption[];
  selectedCategoryName?: string;
  onCategorySelect?: (id: string, name: string) => void;
  /** Provide to render the price sorting select (product list only). */
  sortOptions?: SortOption[];
  sortValue?: string;
  onSortChange?: (value: string) => void;
}

/**
 * The search bar above the admin category and product tables. Purely
 * controlled: pages debounce the value (see `useDebounce`) before searching,
 * which is what stopped a request firing on every keystroke.
 */
export function SearchForm({
  value,
  onChange,
  placeholder = "Search Product",
  categories,
  selectedCategoryName = "All Categories",
  onCategorySelect,
  sortOptions = PRICE_SORT_OPTIONS,
  sortValue = "",
  onSortChange,
}: SearchFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const dropdownRefs = useMemo(() => [toggleRef, listRef], []);
  const closeDropdown = useCallback(() => setIsOpen(false), []);
  useClickOutside(dropdownRefs, closeDropdown, isOpen);

  const selectedSortLabel = sortOptions.find((option) => option.value === sortValue)?.label ?? "None";

  return (
    <div className="min-w-0 rounded-lg border border-gray-200 ring-opacity-4 shadow-xs overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
      <div className="p-4">
        <form className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex" onSubmit={(e) => e.preventDefault()}>
          {/* Search Input */}
          <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow relative">
            <input
              type="search"
              name="search"
              placeholder={placeholder}
              className="block w-full px-3 py-1 text-sm leading-5 rounded-md focus:outline-none dark:text-gray-300 focus:border-gray-200 border border-gray-200 dark:border-gray-600  dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 h-12 bg-gray-100 border-transparent focus:bg-white"
              value={value}
              onChange={(event) => onChange(event.target.value)}
            />
          </div>

          {/* Product categories */}
          {categories && onCategorySelect && (
            <div className="grid grid-cols-6 gap-3  xl:gap-6 lg:gap-6 mb-6">
              <label
                htmlFor="category"
                className=" flex items-center md:justify-center block text-sm font-medium text-gray-700 dark:text-gray-400 col-span-6 sm:col-span-2"
              >
                Category
              </label>
              <div className="col-span-6 sm:col-span-4">
                <div className="relative">
                  <div
                    ref={toggleRef}
                    className="parentCategory bg-white flex items-center justify-between px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer dark:bg-gray-700 dark:border-gray-600"
                    onClick={() => setIsOpen((open) => !open)}
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">{selectedCategoryName}</span>
                    <span className="text-gray-500 dark:text-gray-300">▼</span>
                  </div>

                  {isOpen && (
                    <ul
                      ref={listRef}
                      className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md dark:bg-gray-700 dark:border-gray-600 max-h-40 overflow-y-auto"
                    >
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <li key={category.id}>
                            <button
                              type="button"
                              className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                              onClick={() => {
                                onCategorySelect(category.id, category.name);
                                setIsOpen(false);
                              }}
                            >
                              {category.name}
                            </button>
                          </li>
                        ))
                      ) : (
                        <li>
                          <span className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                            No Categories Available
                          </span>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Price Select */}
          {onSortChange && (
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <select
                className="block w-full px-2 py-1 text-sm dark:text-gray-300 rounded-md form-select focus:border-gray-200 border-gray-200 dark:border-gray-600 border dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 leading-5 h-12 bg-gray-100 border-transparent focus:bg-white"
                value={sortValue}
                onChange={(event) => onSortChange(event.target.value)}
              >
                <option value="" hidden>
                  Price
                </option>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-600">Selected Price: {selectedSortLabel}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default SearchForm;
