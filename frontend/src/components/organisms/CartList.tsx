import { useCartStore } from "../../stores/useCartStore";
import type { CartItem } from "../../types/Cart";
import { CartItemRow } from "../molecules/CartItemRow";

export const CartList = () => {
  const cart: CartItem[] = useCartStore((state) => state.cart);

  return (
    <div>
      {cart.length > 0 ? (
        <div>
          {cart.map((item: CartItem) => (
            <CartItemRow key={item.productId} item={item} />
          ))}
        </div>
      ) : (
        <div>カートが空です。</div>
      )}
    </div>
  );
};
