import { useCartStore } from "../../../stores/useCartStore";
import type { CartItem } from "../../../types/Cart";

interface Props {
  item: CartItem;
}

export const AddToCartButton = ({ item }: Props) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div>
      {item.stock !== 0 ? (
        <button onClick={() => addItem(item)}>カートに追加</button>
      ) : (
        <span>在庫なし</span>
      )}
    </div>
  );
};
