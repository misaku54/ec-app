import type { CartItem } from "../../types/Cart";

type Props = {
  cart: CartItem[];
  total: number;
};

export const OrderSummary = ({ cart, total }: Props) => {
  return (
    <div className="bg-white rounded-lg border border-zinc-200 p-6">
      <h2 className="text-sm font-semibold text-zinc-700 tracking-wide uppercase border-b border-zinc-100 pb-3 mb-4">
        注文内容
      </h2>
      <ul className="space-y-3">
        {cart.map((item) => (
          <li key={item.productId} className="flex justify-between text-sm">
            <span className="text-zinc-700 flex-1 pr-2">
              {item.name}
              <span className="text-zinc-400 ml-1">× {item.count}</span>
            </span>
            <span className="text-zinc-800 font-medium shrink-0">
              ¥{(item.price * item.count).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
      <div className="border-t border-zinc-100 mt-4 pt-4 flex justify-between items-center">
        <span className="text-sm font-semibold text-zinc-700">合計金額</span>
        <span className="text-lg font-bold text-zinc-900">¥{total.toLocaleString()}</span>
      </div>
    </div>
  );
};
