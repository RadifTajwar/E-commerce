import { configureStore } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "@/config/constants";
import { readStorage, writeStorage } from "@/lib/storage";
import type { CartState } from "@/types/cart";
import { authReducer, createUserReducer } from "./slices/auth.slice";
import {
  heroBannerByIdReducer,
  heroBannersReducer,
  updateHeroBannerReducer,
  updateVideoBannerReducer,
  videoBannerByIdReducer,
  videoBannersReducer,
} from "./slices/banner.slice";
import { cartReducer, hydrateCart } from "./slices/cart.slice";
import {
  categoriesReducer,
  categoryByIdReducer,
  createCategoryReducer,
  deleteCategoryReducer,
  updateCategoryReducer,
} from "./slices/category.slice";
import {
  allOrdersReducer,
  createOrderReducer,
  orderByIdReducer,
  orderByUserReducer,
  updateOrderReducer,
} from "./slices/order.slice";
import {
  createParentCategoryReducer,
  deleteParentCategoryReducer,
  parentCategoriesReducer,
  parentCategoryByIdReducer,
  updateParentCategoryReducer,
} from "./slices/parent-category.slice";
import {
  allProductsReducer,
  colorsReducer,
  createProductReducer,
  deleteProductReducer,
  productByIdReducer,
  productBySlugReducer,
  updateProductReducer,
} from "./slices/product.slice";
import { createRatingReducer, ratingByProductIdReducer } from "./slices/rating.slice";

/**
 * Store keys are unchanged from the original app so every existing
 * `useSelector((state) => state.<key>)` keeps working.
 */
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    createParentCategory: createParentCategoryReducer,
    allParentCategories: parentCategoriesReducer,
    parentCategoryById: parentCategoryByIdReducer,
    deleteParentCategoryById: deleteParentCategoryReducer,
    updateParentcategoryData: updateParentCategoryReducer,
    categories: categoriesReducer,
    categoryById: categoryByIdReducer,
    createNewCategory: createCategoryReducer,
    updateCategoryData: updateCategoryReducer,
    deleteCategoryById: deleteCategoryReducer,
    allProducts: allProductsReducer,
    createNewProduct: createProductReducer,
    deleteProduct: deleteProductReducer,
    productById: productByIdReducer,
    updateProductData: updateProductReducer,
    createOrderItem: createOrderReducer,
    allOrders: allOrdersReducer,
    orderById: orderByIdReducer,
    updateOrder: updateOrderReducer,
    allHeroBanner: heroBannersReducer,
    heroBannerById: heroBannerByIdReducer,
    updateHeroBanners: updateHeroBannerReducer,
    allVideoBanners: videoBannersReducer,
    videoBannerById: videoBannerByIdReducer,
    updateVideoBanners: updateVideoBannerReducer,
    productBySlug: productBySlugReducer,
    createUser: createUserReducer,
    loginUser: authReducer,
    getOrderByUser: orderByUserReducer,
    createRating: createRatingReducer,
    getRatingByProductId: ratingByProductIdReducer,
    getColor: colorsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

// ---- cart persistence ---------------------------------------------------------
// Restored after mount (not at module load) so server and client render the
// same empty cart first and hydration never mismatches.
let persistenceStarted = false;

export function startCartPersistence(): void {
  if (persistenceStarted || typeof window === "undefined") return;
  persistenceStarted = true;

  store.dispatch(hydrateCart(readStorage<CartState | undefined>(STORAGE_KEYS.cart, undefined)));

  let last = store.getState().cart;
  store.subscribe(() => {
    const next = store.getState().cart;
    if (next !== last) {
      last = next;
      writeStorage(STORAGE_KEYS.cart, next);
    }
  });
}

export default store;
