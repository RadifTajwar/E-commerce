"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductSearch from "@/components/storefront/nav/ProductSearch";
import { ChevronDownIcon } from "@/components/ui/icons";
import { ROUTES } from "@/config/constants";
import { useCatalogNavigation } from "@/hooks/useCatalogNavigation";
import { fetchAllCategories } from "@/store/slices/category.slice";
import { fetchAllParentCategories } from "@/store/slices/parent-category.slice";

export default function NavMenu() {
  const dispatch = useDispatch();
  const { goToParentCategory, goToCategory } = useCatalogNavigation();

  const { parentCategories, error: parentError } = useSelector(
    (state) => state.allParentCategories
  );
  const { categories, error } = useSelector((state) => state.categories);

  // Fetch all parent categories and categories
  useEffect(() => {
    dispatch(fetchAllParentCategories());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // Show an error message if the parent categories or categories failed to
  // load. (Every hook above runs first, so hook order is stable.)
  if (parentError || error) {
    return <div>Error! {parentError || error}</div>;
  }

  return (
    <>
      <ul className="hidden lg:flex items-center justify-start gap-4 sm:gap-5 md:gap-6 py-3 sm:justify-center">
        {parentCategories?.map((parentCategory) => {
          // Filter the categories for this parent category
          const childCategories = categories?.filter(
            (category) => category.parentCategoryId === parentCategory.id
          );

          return (
            <li key={parentCategory.id} className="group relative">
              <a
                href="#"
                title=""
                className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500"
                style={{ fontSize: ".9rem" }}
                onClick={() => goToParentCategory(parentCategory.name)}
              >
                {parentCategory.name}
                <ChevronDownIcon className="ml-2 w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-primary-500" />
              </a>
              <span
                className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.67)" }}
              ></span>

              {/* Render dropdown only if childCategories exist */}
              {childCategories?.length > 0 && (
                <div className="absolute top-full left-0 min-w-[220px] bg-white border border-slate-200 p-2  shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
                  <ul>
                    {childCategories.map((category) => (
                      <li
                        key={category.id}
                        onClick={() => goToCategory(parentCategory.name, category.name)}
                      >
                        <a
                          className="text-gray-500 flex items-center p-2 hover:text-gray-900"
                          href="#"
                          style={{ fontSize: ".9rem" }}
                        >
                          <span className="whitespace-nowrap">{category.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}

        <li className="group relative">
          <a
            href="#"
            title=""
            className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500"
            style={{ fontSize: ".9rem" }}
          >
            ABOUT US
          </a>
          <span
            className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.67)" }}
          ></span>
        </li>

        <li className="group relative">
          <a
            href="#"
            title=""
            className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500"
            style={{ fontSize: ".9rem" }}
          >
            CONTACT US
          </a>
          <span
            className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.67)" }}
          ></span>
        </li>

        <li className="group relative">
          <Link
            href={ROUTES.shop}
            title=""
            className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500"
            style={{ fontSize: ".9rem" }}
          >
            SHOP NOW
          </Link>
          <span
            className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.67)" }}
          ></span>
        </li>

        <ProductSearch variant="navbar" />
      </ul>
    </>
  );
}
