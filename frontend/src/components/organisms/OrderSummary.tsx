import type { CartItem } from "../../types/Cart";

type Props = {
  cart: CartItem[];
  total: number;
};

export const OrderSummary = ({ cart, total }: Props) => {
  return (
    <div>
      <h2>注文内容</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.productId}>
            <span>{item.name}</span>
            <span> × {item.count}</span>
            <span> ¥{(item.price * item.count).toLocaleString()}</span>
          </li>
        ))}
      </ul>
      <p>合計金額: ¥{total.toLocaleString()}</p>
    </div>
  );
};
