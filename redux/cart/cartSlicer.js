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
            const existingItem = state.items.find(i => i.colorId === item.colorId);

            if (existingItem) {
                // If item exists, increase the quantity by the amount in the payload
                existingItem.quantity += item.quantity || 1; // Defaults to adding 1 if quantity is not provided
            } else {
                // If item doesn't exist, add it with the specified quantity
                state.items.push({ ...item, quantity: item.quantity || 1 }); // Defaults to 1 if quantity is not provided
            }
            console.log(item.price, item.quantity);
            console.log(state.total);
            console.log(item.price * (item.quantity || 1));
            // Update the total by adding the price multiplied by the quantity
            state.total += (item.price * (item.quantity || 1)); // Add total price for the quantity of the item
            console.log(state.total);
        },
        removeItemFromCart: (state, action) => {
            const itemId = action.payload.id;
            const itemToRemove = state.items.find(item => item.colorId === itemId);

            if (itemToRemove) {
                // Update total
                state.total -= itemToRemove.price * itemToRemove.quantity; // Adjust total based on the quantity
            }

            state.items = state.items.filter(item => item.colorId !== itemId);
        },
        incrementItem: (state, action) => {
            const itemId = action.payload.id;
            const existingItem = state.items.find(item => item.colorId === itemId);

            if (existingItem) {
                existingItem.quantity += 1;
                state.total += existingItem.price; // Update total
            }
        },
        decrementItem: (state, action) => {
            const itemId = action.payload.id;
            const existingItem = state.items.find(item => item.colorId === itemId);

            if (existingItem) {
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
                    state.total -= existingItem.price; // Update total
                } else {
                    // If quantity is 1 and we decrement, we should remove the item
                    state.items = state.items.filter(item => item.colorId !== itemId);
                    state.total -= existingItem.price; // Update total
                }
            }
        },
    },
});

export default cartSlice.reducer;
export const { addItemToCart, removeItemFromCart, incrementItem, decrementItem } = cartSlice.actions;
