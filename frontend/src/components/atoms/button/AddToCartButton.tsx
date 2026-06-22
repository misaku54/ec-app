import toast from "react-hot-toast";
import { useCartStore } from "../../../stores/useCartStore";
import type { CartItem } from "../../../types/Cart";

interface Props {
  item: CartItem;
}

export const AddToCartButton = ({ item }: Props) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleClick = () => {
    addItem(item);
    toast.success("カートに追加しました。");
  };

  return (
    <div>
      {item.stock === 0 ? (
        <span className="inline-block rounded bg-zinc-200 px-6 py-2 text-sm font-semibold text-zinc-500">
          在庫切れ
        </span>
      ) : (
        <button
          onClick={handleClick}
          className="w-full rounded bg-zinc-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
        >
          カートに追加
        </button>
      )}
    </div>
  );
};
