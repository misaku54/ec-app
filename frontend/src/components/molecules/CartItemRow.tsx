import { useCartStore } from "../../stores/useCartStore";
import type { CartItem } from "../../types/Cart";

interface Props {
  item: CartItem;
}

export const CartItemRow = ({ item }: Props) => {
  const updateCount = useCartStore((state) => state.updateCount);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex items-center justify-between py-4 border-b border-zinc-100 last:border-b-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-zinc-800">{item.name}</p>
        <p className="text-xs text-zinc-400 mt-0.5">¥{item.price.toLocaleString()} / 個</p>
      </div>

      <div className="flex items-center gap-4">
        <select
          value={item.count}
          onChange={(e) => updateCount(item.productId, Number(e.target.value))}
          className="border border-zinc-200 rounded-md px-2 py-1 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400"
        >
          {Array.from({ length: item.stock }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <span className="w-24 text-right text-sm font-medium text-zinc-800">
          ¥{(item.price * item.count).toLocaleString()}
        </span>

        <button
          onClick={() => removeItem(item.productId)}
          className="text-zinc-300 hover:text-red-400 transition-colors text-xs"
        >
          削除
        </button>
      </div>
    </div>
  );
};
