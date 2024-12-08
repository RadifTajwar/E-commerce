import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart/cartSlicer";
import allCategoriesSlice from "./category/allCategoriesSlice";
import categoryByIdSlice from "./category/categoryByIdSlice";
import createCategorySlice from "./category/createCategorySlice";
import { deleteCategoryByIdSlice } from "./category/deleteCategoryByIdSlice";
import updateCategoryDataSlice from "./category/updateCategoryDataSlice";
import allParentCategorySlice from "./parentCategory/allParentCategorySlice";
import createParentCategoryReducer from "./parentCategory/createParentCategorySlice";
// Load cart state from local storage
const loadCartState = () => {
    try {
        const serializedState = localStorage.getItem("cart");
        return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (error) {
        console.error("Could not load cart state", error);
        return undefined;
    }
};

// Save cart state to local storage
const saveCartState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("cart", serializedState);
    } catch (error) {
        console.error("Could not save cart state", error);
    }
};

// Configure the Redux store
const store = configureStore({
    reducer: {
        cart: cartReducer,
        createParentCategory: createParentCategoryReducer,
        allParentCategories : allParentCategorySlice,
        // categories: categoryReducer,
        categories: allCategoriesSlice,
        categoryById: categoryByIdSlice,
        createNewCategory:createCategorySlice,
        updateCategoryData: updateCategoryDataSlice,
        deleteCategoryById: deleteCategoryByIdSlice
        
    },
    preloadedState: {
        cart: loadCartState(),
    },
});

// Subscribe to store updates to save the cart state in local storage
store.subscribe(() => {
    saveCartState(store.getState().cart);
});

export default store;
