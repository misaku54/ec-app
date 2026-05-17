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
      const existItem = state.cart.find((i) => i.productId === item.productId);
      if (existItem) {
        const newItems = state.cart.map((i) =>
          i.productId === existItem.productId
            ? { ...item, count: i.count + 1 }
            : i,
        );
        return { cart: newItems };
      } else {
        return { cart: [...state.cart, { ...item, count: 1 }] };
      }
    }),
  removeItem: (targetId: number) =>
    set((state) => {
      const newItems = state.cart.filter((item) => item.productId != targetId);
      return { cart: newItems };
    }),
  updateCount: (targetId: number, count: number) =>
    set((state) => {
      const newItems = state.cart.map((item) =>
        item.productId === targetId ? { ...item, count: count } : item,
      );
      return { cart: newItems };
    }),
  clearCart: () => set({ cart: [] }),
}));
