import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        total: 0,
    },
    reducers: {
        addItemToCart: (state, action) => {
            const item = action.payload;
            const existingItem = state.items.find(i => i.id === item.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...item, quantity: 1 });
            }
            // Update total
            state.total += item.price; // Assuming price is in the item object
        },
        removeItemFromCart: (state, action) => {
            const itemId = action.payload.id;
            const itemToRemove = state.items.find(item => item.id === itemId);

            if (itemToRemove) {
                // Update total
                state.total -= itemToRemove.price * itemToRemove.quantity; // Adjust total based on the quantity
            }

            state.items = state.items.filter(item => item.id !== itemId);
        },
        incrementItem: (state, action) => {
            const itemId = action.payload.id;
            const existingItem = state.items.find(item => item.id === itemId);

            if (existingItem) {
                existingItem.quantity += 1;
                state.total += existingItem.price; // Update total
            }
        },
        decrementItem: (state, action) => {
            const itemId = action.payload.id;
            const existingItem = state.items.find(item => item.id === itemId);

            if (existingItem) {
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
                    state.total -= existingItem.price; // Update total
                } else {
                    // If quantity is 1 and we decrement, we should remove the item
                    state.items = state.items.filter(item => item.id !== itemId);
                    state.total -= existingItem.price; // Update total
                }
            }
        },
    },
});

export default cartSlice.reducer;
export const { addItemToCart, removeItemFromCart, incrementItem, decrementItem } = cartSlice.actions;
