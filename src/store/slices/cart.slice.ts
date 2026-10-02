import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CartState } from "@/types/cart";

/**
 * Cart. Lines are keyed by `colorId` (one line per colour variant).
 * `total` is always recomputed from `items`, so it can never drift.
 * Quantities are capped at `availableQuantity` when the caller provides it.
 */

const initialState: CartState = { items: [], total: 0 };

const lineTotal = (item: CartItem) => Number(item.price) * item.quantity;
const recompute = (state: CartState) => {
  state.total = Number(state.items.reduce((sum, i) => sum + lineTotal(i), 0).toFixed(2));
};

const cap = (quantity: number, available?: number) =>
  typeof available === "number" && available >= 0 ? Math.min(quantity, available) : quantity;

export type AddToCartPayload = Omit<CartItem, "quantity"> & { quantity?: number };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /** Replace the whole cart (used to restore from localStorage after mount). */
    hydrateCart: (state, action: PayloadAction<CartState | undefined>) => {
      const incoming = action.payload;
      state.items = Array.isArray(incoming?.items) ? incoming.items : [];
      recompute(state);
    },
    addItemToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const item = action.payload;
      if (typeof item.availableQuantity === "number" && item.availableQuantity <= 0) return;

      const requested = item.quantity && item.quantity > 0 ? item.quantity : 1;
      const existing = state.items.find((i) => i.colorId === item.colorId);
      if (existing) {
        if (item.availableQuantity !== undefined) existing.availableQuantity = item.availableQuantity;
        existing.quantity = cap(existing.quantity + requested, existing.availableQuantity);
      } else {
        state.items.push({ ...item, quantity: cap(requested, item.availableQuantity) });
      }
      recompute(state);
    },
    removeItemFromCart: (state, action: PayloadAction<{ id: string }>) => {
      state.items = state.items.filter((i) => i.colorId !== action.payload.id);
      recompute(state);
    },
    incrementItem: (state, action: PayloadAction<{ id: string }>) => {
      const existing = state.items.find((i) => i.colorId === action.payload.id);
      if (existing) {
        existing.quantity = cap(existing.quantity + 1, existing.availableQuantity);
        recompute(state);
      }
    },
    decrementItem: (state, action: PayloadAction<{ id: string }>) => {
      const existing = state.items.find((i) => i.colorId === action.payload.id);
      if (!existing) return;
      if (existing.quantity > 1) existing.quantity -= 1;
      else state.items = state.items.filter((i) => i.colorId !== action.payload.id);
      recompute(state);
    },
    resetCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { hydrateCart, addItemToCart, removeItemFromCart, incrementItem, decrementItem, resetCart } =
  cartSlice.actions;
export const cartReducer = cartSlice.reducer;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) => state.cart.total;
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((n, i) => n + i.quantity, 0);
