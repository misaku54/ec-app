import { Link } from “react-router”;
import { useCartStore } from “../../stores/useCartStore”;
import { CartList } from “../organisms/CartList”;

export const CartPage = () => {
  const total = useCartStore((state) => state.getTotal());

  return (
    <div>
      <CartList />
      <p>合計金額:{total}円</p>
      <Link to=”/checkout”>注文に進む</Link>
    </div>
  );
};
