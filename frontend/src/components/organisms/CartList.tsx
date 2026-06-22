import { useCartStore } from "../../stores/useCartStore";
import type { CartItem } from "../../types/Cart";
import { CartItemRow } from "../molecules/CartItemRow";

export const CartList = () => {
  const cart: CartItem[] = useCartStore((state) => state.cart);

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-zinc-200 p-12 text-center">
        <p className="text-sm text-zinc-400">カートに商品がありません</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-zinc-200 px-6">
      {cart.map((item: CartItem) => (
        <CartItemRow key={item.productId} item={item} />
      ))}
    </div>
  );
};
