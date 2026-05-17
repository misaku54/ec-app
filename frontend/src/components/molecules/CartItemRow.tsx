import { useCartStore } from "../../stores/useCartStore";
import type { CartItem } from "../../types/Cart";

// カート詳細の１カート分コンポーネント
interface Props {
  item: CartItem;
}

const selectCount = [1, 2, 3, 4, 5];

export const CartItemRow = ({ item }: Props) => {
  const updateCount = useCartStore((state) => state.updateCount);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div>
      <span>{item.name}</span>
      <span>{item.price}円</span>
      <span>{item.count}個</span>
      <button onClick={() => removeItem(item.productId)}>削除</button>
      <select
        value={item.count}
        onChange={(e) => updateCount(item.productId, Number(e.target.value))}
      >
        {Array.from({ length: item.stock })}
        {selectCount.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <span>個</span>
    </div>
  );
};
