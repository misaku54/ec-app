import { Link } from "react-router";
import { useCartStore } from "../../stores/useCartStore";
import { CartList } from "../organisms/CartList";

export const CartPage = () => {
  const cart = useCartStore((state) => state.cart);
  const total = useCartStore((state) => state.getTotal());

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6 pb-2 border-b border-zinc-200">
        カート
      </h1>
      <CartList />
      {cart.length > 0 && (
        <div className="mt-6 bg-white rounded-lg border border-zinc-200 p-6 flex items-center justify-between">
          <div>
            <span className="text-sm text-zinc-400">合計金額</span>
            <p className="text-xl font-bold text-zinc-900">¥{total?.toLocaleString()}</p>
          </div>
          <Link
            to="/checkout"
            className="bg-zinc-900 text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-zinc-700 transition-colors"
          >
            注文に進む
          </Link>
        </div>
      )}
    </div>
  );
};
