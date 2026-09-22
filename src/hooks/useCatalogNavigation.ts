"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/constants";
import { slugify } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { clearState } from "@/store/slices/product.slice";

/**
 * The catalogue navigation that used to be copy-pasted (with a localStorage
 * write) into the sidebar, the nav menu and both shop pages.
 *
 * Category identity now travels in the URL only — `/shop/productCategory/<parent>`
 * and `/shop/productCategory/<parent>/<child>` — so deep links and refreshes work.
 */
export interface CatalogNavigation {
  /** `/shop/productCategory/<parent-slug>` */
  goToParentCategory: (parentCategoryName: string) => void;
  /** `/shop/productCategory/<parent-slug>/<child-slug>` */
  goToCategory: (parentCategoryName: string, categoryName: string) => void;
  /** `/products/<slug>` */
  goToProduct: (productSlug: string) => void;
}

export interface CatalogNavigationOptions {
  /** Called after every navigation (used by the drawer to close itself). */
  onNavigate?: () => void;
}

export function useCatalogNavigation(options: CatalogNavigationOptions = {}): CatalogNavigation {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { onNavigate } = options;

  const navigate = useCallback(
    (href: string) => {
      dispatch(clearState());
      router.push(href);
      onNavigate?.();
    },
    [dispatch, router, onNavigate],
  );

  return useMemo<CatalogNavigation>(
    () => ({
      goToParentCategory: (parentCategoryName: string) =>
        navigate(ROUTES.shopCategory(slugify(parentCategoryName))),
      goToCategory: (parentCategoryName: string, categoryName: string) =>
        navigate(ROUTES.shopCategory(slugify(parentCategoryName), slugify(categoryName))),
      goToProduct: (productSlug: string) => navigate(ROUTES.product(productSlug)),
    }),
    [navigate],
  );
}

export default useCatalogNavigation;
