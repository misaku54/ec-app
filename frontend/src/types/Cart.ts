// カート内の商品情報
export interface CartItem {
  productId: number;
  price: number;
  name: string;
  stock: number;
  count: number;
}

// 状態管理対象:カート情報
export interface CartState {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (targetId: number) => void;
  updateCount: (targetId: number, count: number) => void;
  clearCart: () => void;
}
