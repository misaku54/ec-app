// カート詳細ページ
// カートリスト＋合計表示＋購入ボタンの組み合わせ(予定)

import { useCartStore } from "../../stores/useCartStore";
import { CartList } from "../organisms/CartList";

// selectorとは、storeの状態から“必要な値だけ”取り出す関数
//  (state) => state.getTotal()は「getTotal()の実行結果（合計金額）」だけを取り出すselector。
// selectorの戻り値が変わった時だけ再レンダリング
// // getTotal()の戻り値（合計金額）が変わった時だけCartPageが再レンダリングされる
export const CartPage = () => {
  console.log("CartPageレンダリング");
  const total = useCartStore((state) => state.getTotal());

  return (
    <div>
      <CartList />
      <p>合計金額:{total}円</p>
      <button>注文に進む（BE未実装）</button>
    </div>
  );
};
