# リテラル Union 型 と Record 型

- 書いた日: 2026-06-23
- 関連コード: `frontend/src/types/Order.ts`（`OrderStatus`）, `frontend/src/components/atoms/OrderStatusLabel.tsx`
- きっかけ: 注文ステータスの型とバッジの色分けマップを書くため

---

## 1. リテラル Union 型 ＝「決まった値だけ許可する型」

```ts
export type OrderStatus =
  | "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
```

- `"PENDING"` のような **文字列そのもの** が型 → **文字列リテラル型**
- `|`（OR）で繋ぐ → **Union 型**＝「このうちどれか1つ」

`string` との違い：

```ts
const a: string      = "なんでもOK";   // どんな文字列でも通る
const b: OrderStatus = "PENDING";      // ✅ 5つのうち1つ
const c: OrderStatus = "pending";      // ❌ 小文字は別物
const d: OrderStatus = "PAID";         // ❌ 5つに無い → コンパイルエラー
```

→ **取りうる値を限定**できる。タイポ検出・入力補完・網羅チェックが効く。
（数値でも `type Dice = 1|2|3|4|5|6` のように書ける）

---

## 2. Record 型 ＝「キー全部に値を持つオブジェクト」型

```ts
Record<K, V>   // K = キーの型 / V = 値の型
```

例：ステータス → Tailwind クラスの対応表

```ts
const statusStyle: Record<OrderStatus, string> = {
  PENDING:   "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPED:   "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-200 text-gray-600",
};

statusStyle[status]  // ステータスをキーに引くだけ（switch 不要）
```

`Record<OrderStatus, string>` は次と同じ意味：

```ts
{ PENDING: string; CONFIRMED: string; SHIPPED: string; DELIVERED: string; CANCELLED: string; }
```

---

## 3. なぜ Record が嬉しいか：書き忘れを型が防ぐ

`Record<OrderStatus, string>` は **5キー全部を必須**にする。

```ts
const statusStyle: Record<OrderStatus, string> = {
  PENDING: "...", CONFIRMED: "...", SHIPPED: "...", DELIVERED: "...",
  // CANCELLED を書き忘れ → ❌ "Property 'CANCELLED' is missing"
};
const x: Record<OrderStatus, string> = { ..., PAID: "..." }; // ❌ 'PAID' は OrderStatus に無い
```

→ **「ステータスが増えたら色定義も必ず足さないとビルドが通らない」** という安全装置になる。

緩い型との対比：

```ts
{ [key: string]: string }        // ❌ どんなキーでもOK・書き忘れ検出されない
Record<OrderStatus, string>      // ✅ 5キー必須を強制（リテラル Union と相性◎）
```

---

## まとめ

| 型 | 意味 | 効果 |
|---|---|---|
| `"A" \| "B" \| "C"` | リテラル Union | 取りうる値を限定（タイポ・補完・網羅） |
| `Record<K, V>` | K 全部に V を持つオブジェクト | 対応表を作る＋全キー定義を強制 |

**合わせ技がポイント:** リテラル Union 型をキーにした `Record` は、「決まった値の集合」に対して「漏れなく対応表を作る」を型で保証してくれる。switch より宣言的で安全。
