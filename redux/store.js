import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart/cartSlicer";
import allCategoriesSlice from "./category/allCategoriesSlice";
import categoryByIdSlice from "./category/categoryByIdSlice";
import createCategorySlice from "./category/createCategorySlice";
import deleteCategoryByIdSlice from "./category/deleteCategoryByIdSlice";
import updateCategoryDataSlice from "./category/updateCategoryDataSlice";
import allHeroBannerReducer from "./heroBanner/allHeroBannerSlice";
import heroBannerByIdReducer from "./heroBanner/heroBannerByIdSlice";
import updateHeroBannerReducer from "./heroBanner/updateHeroBannerSlice";
import createOrderReducer from "./order/createOrderSlice";
import allOrderReducer from "./order/getAllOrderSlice";
import getOrderByIdReducer from "./order/getOrderByIdSlice";
import updateOrderReducer from "./order/updateOrderSlice";
import allParentCategorySlice from "./parentCategory/allParentCategorySlice";
import createParentCategoryReducer from "./parentCategory/createParentCategorySlice";
import deleteParentCategoryByIdSlice from "./parentCategory/deleteParentCategoryByIdSlice";
import parentCategoryByIdSlice from "./parentCategory/parentCategoryByIdSlice";
import updateParentCategoryDataSlice from "./parentCategory/updateParentCategoryDataSlice";
import allProductReducer from "./product/allProductsSlice";
import createProductReducer from "./product/createProductSlice";
import deleteProductReducer from "./product/deleteProductByIdSlice";
import productByIdReducer from "./product/productByIdSlice";
import updateProductReducer from "./product/updateProductDataSlice";
import allVideoBannerReducer from "./video/allVideoBannerSlice";
import updateVideoBannerReducer from "./video/updateVideoBannerSlice";
import videoBannerByIdReducer from "./video/videoBannerByIdSlice";
// Check if in browser
const isBrowser = typeof window !== "undefined";

// Load cart state from localStorage if in the browser
const loadCartState = () => {
    if (isBrowser) {
        try {
            const serializedState = localStorage.getItem("cart");
            return serializedState ? JSON.parse(serializedState) : undefined;
        } catch (error) {
            console.error("Could not load cart state", error);
            return undefined;
        }
    }
    return undefined; // Return undefined if not in the browser
};

// Save cart state to localStorage if in the browser
const saveCartState = (state) => {
    if (isBrowser) {
        try {
            const serializedState = JSON.stringify(state);
            localStorage.setItem("cart", serializedState);
        } catch (error) {
            console.error("Could not save cart state", error);
        }
    }
};

// Configure the Redux store
const store = configureStore({
    reducer: {
        cart: cartReducer,
        createParentCategory: createParentCategoryReducer,
        allParentCategories: allParentCategorySlice,
        parentCategoryById: parentCategoryByIdSlice,
        deleteParentCategoryById: deleteParentCategoryByIdSlice,
        updateParentcategoryData: updateParentCategoryDataSlice,
        categories: allCategoriesSlice,
        categoryById: categoryByIdSlice,
        createNewCategory: createCategorySlice,
        updateCategoryData: updateCategoryDataSlice,
        deleteCategoryById: deleteCategoryByIdSlice,
        allProducts: allProductReducer,
        createNewProduct: createProductReducer,
        deleteProduct: deleteProductReducer,
        productById: productByIdReducer,
        updateProductData: updateProductReducer,
        createOrderItem: createOrderReducer,
        allOrders: allOrderReducer,
        orderById :getOrderByIdReducer,
        updateOrder: updateOrderReducer,
        allHeroBanner:allHeroBannerReducer,
        heroBannerById: heroBannerByIdReducer,
        updateHeroBanners: updateHeroBannerReducer,
        allVideoBanners: allVideoBannerReducer,
        videoBannerById: videoBannerByIdReducer,
        updateVideoBanners: updateVideoBannerReducer,
    },
    preloadedState: {
        cart: loadCartState(), // Load cart state only if in browser
    },
});

// Subscribe to store updates to save the cart state in localStorage
store.subscribe(() => {
    saveCartState(store.getState().cart);
});

export default store;
