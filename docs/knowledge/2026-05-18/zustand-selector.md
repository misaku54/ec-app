# 今日の学びまとめ

## Zustandのselectorとは？
- storeの状態から“必要な値だけ”取り出す関数
- 例: `(state) => state.cart` や `(state) => state.getTotal()`
- selectorの戻り値が変わった時だけ再レンダリングされる

## getTotalの実装・使い方
- 合計金額は「状態」ではなく「計算ロジック」としてstoreに持たせる
- `create((set, get) => ({ getTotal: () => get().cart.reduce(...) }))` の形でOK
- selectorで `useCartStore((state) => state.getTotal())` と書くとcartが変わるたびに再評価

## reduceの初期値・挙動
- 初期値（第2引数）に依存する
- 空配列+初期値0なら0が返る
- コールバックの戻り値が次のaccになり、最終的にreduceの戻り値になる

## Atomic Designの責務分離
- 合計金額や注文ボタンはCartPage（pages）で管理
- CartListやCartItemRowはリスト表示専用

## 注文フローの進め方
- まずはBE（API）→FE（画面）の順で実装が現場流
- /checkoutで使うAPIは`POST /api/order/create`

---

疑問点や気づきもどんどんメモしておくと、後で見返した時に成長が実感できるよ！
