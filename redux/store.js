import localStorageUtil from "@/utils/localStorageUtil";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart/cartSlicer";
import allCategoriesSlice from "./category/allCategoriesSlice";
import categoryByIdSlice from "./category/categoryByIdSlice";
import createCategorySlice from "./category/createCategorySlice";
import deleteCategoryByIdSlice from "./category/deleteCategoryByIdSlice";
import updateCategoryDataSlice from "./category/updateCategoryDataSlice";
import getColorReducer from "./color/getColorSlice";
import allHeroBannerReducer from "./heroBanner/allHeroBannerSlice";
import heroBannerByIdReducer from "./heroBanner/heroBannerByIdSlice";
import updateHeroBannerReducer from "./heroBanner/updateHeroBannerSlice";
import createOrderReducer from "./order/createOrderSlice";
import allOrderReducer from "./order/getAllOrderSlice";
import getOrderByIdReducer from "./order/getOrderByIdSlice";
import getOrderByUserReducer from "./order/getOrderByUserSlice";
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
import productBySlugReducer from "./product/productBySlugSlice";
import updateProductReducer from "./product/updateProductDataSlice";
import createRatingReducer from "./rating/createRatingSlice";
import getRatingByProductIdReducer from "./rating/ratingByProductIdSlice";
import createUserReducer from "./user/createUserSlice";
import loginUserReducer from "./user/userLoginSlice";
import allVideoBannerReducer from "./video/allVideoBannerSlice";
import updateVideoBannerReducer from "./video/updateVideoBannerSlice";
import videoBannerByIdReducer from "./video/videoBannerByIdSlice";
// Check if in browser


// Load cart state from localStorage if in the browser
const loadCartState = () => {

        try {
            const serializedState = localStorageUtil.getItem("cart");
            return serializedState ? JSON.parse(serializedState) : undefined;
        } catch (error) {
            console.error("Could not load cart state", error);
            return undefined;
        }
    
    
};

// Save cart state to localStorage if in the browser
const saveCartState = (state) => {
  
        try {
            const serializedState = JSON.stringify(state);
            localStorageUtil.setItem("cart", serializedState);
        } catch (error) {
            console.error("Could not save cart state", error);
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
        productBySlug: productBySlugReducer,
        createUser: createUserReducer,
        loginUser: loginUserReducer,
        getOrderByUser: getOrderByUserReducer,
        createRating: createRatingReducer,
        getRatingByProductId: getRatingByProductIdReducer,
        getColor : getColorReducer,
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
