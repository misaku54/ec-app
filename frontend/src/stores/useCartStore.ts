import { create } from "zustand";
import type { CartItem, CartState } from "../types/Cart";

export const useCartStore = create<CartState>()((set, get) => ({
  cart: [],
  addItem: (item: CartItem) =>
    set((state) => {
      const idx = state.cart.findIndex((i) => i.productId === item.productId);
      const isInCart = idx !== -1;

      if (isInCart) {
        const newCart = [...state.cart];
        newCart[idx] = { ...newCart[idx], count: newCart[idx].count + 1 };
        return { cart: newCart };
      }

      return { cart: [...state.cart, { ...item, count: 1 }] };
    }),
  removeItem: (targetId: number) =>
    set((state) => {
      const newCart = state.cart.filter((item) => item.productId != targetId);
      return { cart: newCart };
    }),
  updateCount: (targetId: number, count: number) =>
    set((state) => {
      const newCart = state.cart.map((item) =>
        item.productId === targetId ? { ...item, count: count } : item,
      );
      return { cart: newCart };
    }),
  clearCart: () => set({ cart: [] }),
  getTotal: () => {
    return get().cart.reduce(
      (total, item) => total + item.price * item.count,
      0,
    );
  },
}));
