import { create } from "zustand";

// カート内の商品情報
interface CartItem {
  productId: number;
  price: number;
  name: string;
  stock: number;
  count: number;
}

// 状態管理対象:カート情報
interface CartState {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (targetId: number) => void;
  updateCount: (targetId: number, count: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
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
}));
