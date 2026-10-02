"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";
import ColorBar from "@/components/ui/components/shop/colorBar";
import InfiniteScroll from "@/components/ui/components/shop/infiniteScroll";
import RangeBar from "@/components/ui/components/shop/rangeBar";
import SortingSection from "@/components/ui/components/shop/sortingSection";
import StockStatus from "@/components/ui/components/shop/stockStatus";
import { ChevronDownIcon } from "@/components/ui/icons";
import { PRICE_FILTER } from "@/config/constants";
import { useCatalogNavigation } from "@/hooks/useCatalogNavigation";
import { slugify } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllCategories } from "@/store/slices/category.slice";
import { fetchAllParentCategories } from "@/store/slices/parent-category.slice";
import { clearState, fetchAllProducts, fetchColors } from "@/store/slices/product.slice";
import type { Category, ParentCategory, ProductListQuery } from "@/types";

/**
 * The shop grid + filter rail, shared by `/shop` and
 * `/shop/productCategory/[...slug]`.
 *
 * Category identity comes from `slug` (parent slug, optional child slug) and is
 * resolved against the loaded taxonomy — never from localStorage — so deep
 * links and refreshes work. Filters come from the query string only; the
 * fetch effect re-runs whenever the derived params change.
 */
export interface ShopBrowserProps {
  /** Catch-all route segments: `[parentSlug]` or `[parentSlug, childSlug]`. */
  slug?: string[];
  /**
   * Taxonomy rendered on the server. When present the browser uses it directly,
   * so the category strip and the slug resolution are correct on first paint
   * and no extra round trip is made.
   */
  initialParentCategories?: ParentCategory[];
  initialCategories?: Category[];
}

interface ResolvedCategory {
  categoryId?: string;
  parentCategoryId?: string;
  /** False while the taxonomy needed to resolve the slug is still loading. */
  resolved: boolean;
}

/** Filters that live in the query string (shared by both routes). */
function useUrlFilters(): ProductListQuery {
  const searchParams = useSearchParams();
  const key = searchParams.toString();

  return useMemo(() => {
    const params = new URLSearchParams(key);
    const minPrice = params.get("min_price");
    const maxPrice = params.get("max_price");
    const filterColor = params.get("filter_color");
    const sortOrder = params.get("orderby");
    const stockStatus = params.get("stock_status");
    const statuses = stockStatus ? stockStatus.split(",") : [];

    const filters: ProductListQuery = {};
    if (minPrice && maxPrice) {
      filters.startPrice = minPrice;
      filters.endPrice = maxPrice;
    }
    if (filterColor) filters.colorName = filterColor;
    if (sortOrder) {
      filters.sortBy = "discountedPrice";
      filters.sortOrder = sortOrder as ProductListQuery["sortOrder"];
    }
    if (statuses.includes("inStock")) filters.inStock = true;
    if (statuses.includes("onSale")) filters.onSale = true;
    return filters;
  }, [key]);
}

export default function ShopBrowser({
  slug,
  initialParentCategories,
  initialCategories,
}: ShopBrowserProps) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const filters = useUrlFilters();

  const hasServerTaxonomy = Boolean(initialParentCategories && initialCategories);
  const { parentCategories: storeParentCategories } = useAppSelector((state) => state.allParentCategories);
  const { categories: storeCategories } = useAppSelector((state) => state.categories);
  const parentCategories = initialParentCategories ?? storeParentCategories;
  const categories = initialCategories ?? storeCategories;
  const { products, error } = useAppSelector((state) => state.allProducts);
  const colorStatus = useAppSelector((state) => state.getColor.status);

  const [isSortBarVisible, setSortBarVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  // Keeps the empty-result message from flashing before the first request.
  const [hasRequested, setHasRequested] = useState(false);

  const { goToParentCategory, goToCategory } = useCatalogNavigation();

  // Taxonomy: needed both for the category strip and to resolve the slug.
  // Skipped when the server already rendered it.
  useEffect(() => {
    if (hasServerTaxonomy) return;
    void dispatch(fetchAllParentCategories());
    void dispatch(fetchAllCategories());
  }, [dispatch, hasServerTaxonomy]);

  // Colours are rendered twice (desktop + mobile rail) but fetched once here.
  useEffect(() => {
    if (colorStatus === "idle") void dispatch(fetchColors());
  }, [dispatch, colorStatus]);

  const parentSlug = slug?.[0];
  const childSlug = slug?.[1];

  const { categoryId, parentCategoryId, resolved }: ResolvedCategory = useMemo(() => {
    if (!parentSlug) return { resolved: true };
    // Both lists must be in before a slug can be turned into ids.
    if (parentCategories.length === 0 || categories.length === 0) return { resolved: false };

    const parent = parentCategories.find((p) => slugify(p.name) === parentSlug);
    if (!parent) return { resolved: true };
    if (!childSlug) return { parentCategoryId: parent.id, resolved: true };

    const child = categories.find(
      (c) => c.parentCategoryId === parent.id && slugify(c.name) === childSlug,
    );
    return child
      ? { categoryId: child.id, resolved: true }
      : { parentCategoryId: parent.id, resolved: true };
  }, [parentSlug, childSlug, parentCategories, categories]);

  const fetchParams = useMemo<ProductListQuery>(
    () => ({ ...filters, ...(categoryId ? { categoryId } : {}), ...(parentCategoryId ? { parentCategoryId } : {}) }),
    [filters, categoryId, parentCategoryId],
  );

  // One fetch effect, driven purely by the URL-derived params.
  useEffect(() => {
    if (!resolved) return;
    dispatch(clearState());
    void dispatch(fetchAllProducts(fetchParams));
    setHasRequested(true);
    setSortBarVisible(false);
  }, [dispatch, fetchParams, resolved]);

  const toggleSortBar = () => setSortBarVisible((visible) => !visible);
  const toggleDropdown = () => setIsVisible((visible) => !visible);

  const maxPrice = searchParams.get("max_price") ?? PRICE_FILTER.max;
  const minPrice = searchParams.get("min_price") ?? PRICE_FILTER.min;

  return (
    <>
      {/* Overlay */}
      {isSortBarVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={toggleSortBar} />
      )}

      <div className="full_upper_container z-50">
        <div className="upper_text max-w-8xl flex justify-center mt-8 ">
          {error && <p>Error: {error}</p>}
          <div className="text-center">
            <h1 className="text-4xl font-bold ">
              <span style={{ color: "#E8A811" }}>SHOP</span> NOW
            </h1>
            {/* Reads as a set of category controls. These used to be bare
                `<a href="#">` text that only looked clickable on hover, so it
                was not obvious the strip was navigation at all. */}
            <div className="category_section large-screen ">
              <p className="hidden lg:block mt-3 text-[11px] uppercase tracking-[0.18em] text-gray-400">
                Browse by category
              </p>
              <ul className="hidden lg:flex items-center justify-center gap-x-3 pt-3 pb-1">
                {parentCategories?.map((parentCategory) => {
                  // Filter the categories for this parent category
                  const childCategories = categories?.filter(
                    (category) => category.parentCategoryId === parentCategory?.id,
                  );
                  const isActive = slugify(parentCategory?.name ?? "") === parentSlug;
                  return (
                    <li className="group relative" key={parentCategory?.id}>
                      <button
                        type="button"
                        className={`flex items-center gap-1.5 rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-300 text-gray-800 hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                        }`}
                        onClick={() => goToParentCategory(parentCategory?.name)}
                      >
                        {parentCategory?.name}
                        {childCategories?.length > 0 && (
                          <ChevronDownIcon className="h-3.5 w-3.5 opacity-60" />
                        )}
                      </button>

                      {/* Render dropdown only if childCategories exist */}
                      {childCategories?.length > 0 && (
                        <div className="absolute left-0 top-full z-50 mt-2 flex min-w-[250px] rounded-lg border border-slate-200 bg-white p-2 text-left opacity-0 shadow-xl transition-opacity duration-200 invisible group-hover:visible group-hover:opacity-100">
                          <div className="items w-full">
                            <ul className="w-full p-2">
                              {childCategories?.map((category) => (
                                <li className="group/nested relative w-full" key={category.id}>
                                  <button
                                    type="button"
                                    className="w-full rounded-md px-3 py-2 text-left transition-colors hover:bg-gray-50"
                                    onClick={() => goToCategory(parentCategory?.name, category.name)}
                                  >
                                    <span className="block text-sm font-semibold text-gray-900 group-hover/nested:text-gray-600">
                                      {category.name}
                                    </span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="category_section small-screen">
              <div className="lg:hidden flex items-center gap-x-6 sm:gap-x-5 lg:gap-x-7 xl:gap-x-16 2xl:gap-x-20 py-3 justify-center">
                <div className="group relative ">
                  <button
                    className="py-3 flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-primary-500"
                    style={{ fontSize: ".9rem" }}
                    onClick={toggleDropdown}
                  >
                    CATEGORIES
                    <ChevronDownIcon className="ml-2 w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-primary-500" />
                  </button>
                  <span
                    className="absolute bottom-2 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.67)" }}
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`dropDown_category w-full text-white transition-all duration-500 ease-in-out overflow-hidden ${
            isVisible ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{ transitionProperty: "max-height, opacity" }}
        >
          {error && <p>Error: {error}</p>}
          {parentCategories?.length > 0 && (
            <div className="inner p-3 w-full">
              <div className="dropdown_inner px-2 bg-white w-full">
                <ul className="w-full lg:hidden items-center justify-start gap-x-6 sm:gap-x-5 lg:gap-x-7 xl:gap-x-16 2xl:gap-x-20 py-3 ">
                  {parentCategories?.map((parentCategory) => (
                    <li key={parentCategory?.id} className="group relative w-full py-3 cursor-pointer">
                      <button
                        type="button"
                        onClick={() => goToParentCategory(parentCategory?.name)}
                        className="py-3 text-gray-900 group-hover:text-gray-600 transition-all duration-300 text-start font-semibold text-kg"
                        style={{ fontSize: ".9rem" }}
                      >
                        {parentCategory?.name}

                        <span
                          className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"
                          style={{ backgroundColor: "rgba(0, 0, 0, 0.67)" }}
                        ></span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="full_lower_container_small_screen my-6 lg:hidden">
        <div className="text_section w-full  my-6 px-3">
          <div className="flex py-3 justify-between border-b border-gray-300">
            <p className="text-gray-500 cursor-pointer font-light text-sm">
              Home / <span className="text-black font-medium">Shop</span>
            </p>
            <p className="font-light text-gray-500 text-sm">Showing Result</p>
          </div>
        </div>
      </div>

      <div className="full_lower_container_small_screen my-14 lg:px-3 z-20">
        <div className="text_section  max-w-7xl mx-auto  my-6 lg:px-3">
          {error && <p>Error: {error}</p>}

          <div className="flex py-3 justify-between  lg:px-3 gap-x-6">
            <div className="left w-1/5   transition-all duration-300 lg:static hidden lg:block">
              <RangeBar maxPrice={maxPrice} minPrice={minPrice} />
              <div className="line w-full h-px bg-gray-300 my-6"></div>
              <ColorBar />
              <div className="line w-full h-px bg-gray-300 my-6"></div>
              <StockStatus />
              <div className="line w-full h-px bg-gray-300 my-6"></div>
            </div>

            <div
              className={`left w-80 bg-white p-4 overflow-scroll fixed z-20  transition-all duration-300 lg:static  lg:hidden ${
                isSortBarVisible ? " top-0 left-0 bottom-0 " : " top-0 -left-full"
              } `}
            >
              <div className={`${isSortBarVisible ? "translate-x-0" : "-translate-x-full"}`}>
                <RangeBar maxPrice={maxPrice} minPrice={minPrice} />
                <div className="line w-full h-px bg-gray-300 my-6"></div>
                <ColorBar />
                <div className="line w-full h-px bg-gray-300 my-6"></div>
                <StockStatus />
                <div className="line w-full h-px bg-gray-300 my-6"></div>
              </div>
            </div>
            <div className="right  w-full lg:w-4/5 px-4 ">
              <div className="flex justify-between items-center pb-5">
                <div className="tex hidden lg:block">
                  <p className=" text-sm  decoration-gray-800 font-semibold  my-3">
                    <span className="hover:text-gray-900 transition-colors duration-300 text-gray-500 font-light cursor-pointer">
                      Home{" "}
                    </span>
                    / Shop
                  </p>
                </div>
                <div className="tex  lg:hidden cursor-pointer">
                  <button className=" text-sm  decoration-gray-800 font-semibold  my-3" onClick={toggleSortBar}>
                    <MenuIcon />
                  </button>
                </div>
                <div className="sorting_section ">
                  <SortingSection />
                </div>
              </div>

              {resolved && hasRequested && (
                <div className="infiniteScroll ">
                  <InfiniteScroll
                    products={products}
                    filters={filters}
                    categoryId={categoryId}
                    parentCategoryId={parentCategoryId}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
