# TypeScript の型関数（ジェネリクスで型を計算する）

- 書いた日: 2026-06-20
- 関連コード: `frontend/src/lib/react-query.ts`
- きっかけ: react-query 導入で出てきた `ApiFnReturnType` / `QueryConfig` / `MutationConfig` の型を読むため

---

## 0. 一番大事な発想：「型を受け取って型を返す関数」がある

`type Foo<T> = ...` は **型版の関数**。値の関数とまったく同じ構造で読める。

```ts
// 値の世界：値を受け取って値を返す
function double(n: number) {
  return n * 2;   // ← return（戻り値）
}
double(5) // → 10

// 型の世界：型を受け取って型を返す
type ApiFnReturnType<FnType> = Awaited<ReturnType<FnType>>;
//                   ^^^^^^ 引数(型)             ^^^^^^^^ 戻り値(型) ＝ "=" の右側
ApiFnReturnType<typeof getOrder> // → OrderDetail
```

| | 値の関数 | 型関数 |
|---|---|---|
| 引数の置き場 | `(n: number)` 丸カッコ | `<T>` 山カッコ |
| 戻り値の置き場 | `return ...` | `=` の右側 |
| 呼び出し方 | `double(5)` | `Foo<SomeType>` |
| いつ動く | 実行時 | **コンパイル時だけ。実行時には消える（1バイトも残らない）** |

> ポイント:「型を宣言してるのに戻り値がある？」と混乱しがちだが、最初から **“型を計算して返す関数”** を書いているだけ。`=` の右が return 文。

---

## 1. 組み込みの型関数（今日出てきたもの）

### `ReturnType<F>` — 関数の戻り値の型を取り出す

```ts
type F = () => Promise<OrderDetail>;
ReturnType<F> // → Promise<OrderDetail>
```

名前に「Return（戻り値）」が入っているのでややこしいが、やるのは **戻り値の型の抽出だけ**。

### `Awaited<T>` — Promise を剥がして中身を取り出す（`await` の型版）

```ts
Awaited<Promise<OrderDetail>> // → OrderDetail
```

### `Omit<T, K>` — オブジェクト型から指定キーを取り除く

```ts
type User = { id: number; name: string; password: string };
Omit<User, "password">          // → { id: number; name: string }
Omit<User, "id" | "password">   // → { name: string }  （複数は | で並べる）
```

### `Pick<T, K>` — `Omit` の逆。指定キーだけ抜き出す

```ts
Pick<User, "id"> // → { id: number }
```

→ **`Omit`＝「これ以外」／`Pick`＝「これだけ」** で対に覚える。

### `Parameters<F>` と `[0]` — 関数の引数の型を取り出す

```ts
const cancelOrder = (vars: { orderId: number }): Promise<void> => {...};

Parameters<typeof cancelOrder>     // → [{ orderId: number }]  （引数をタプルで取る）
Parameters<typeof cancelOrder>[0]  // → { orderId: number }    （0番目＝第1引数の型）
```

---

## 2. `satisfies` — 型チェックはするが具体型は保つ

```ts
// : DefaultOptions  だと型が DefaultOptions に "広がって" しまう
// satisfies なら「適合チェックはする」かつ「書いたままの具体型を保つ」
export const queryConfig = {
  queries: { refetchOnWindowFocus: false, retry: false, staleTime: 60 * 1000 },
} satisfies DefaultOptions;
```

- タイポ（`refetchOnWindowFocas` 等）は弾かれる
- かつ補完・具体値の型推論は失わない（良いとこ取り）

---

## 3. `{ ... }` は文脈で「値」にも「型」にもなる（混乱ポイント）

| 書いたもの | 中身 | 正体 |
|---|---|---|
| `{ orderId: 1234 }` | `1234`（具体的なデータ） | **値**（実物のオブジェクト） |
| `{ orderId: number }` | `number`（型の名前） | **型**（オブジェクトの "形" の説明） |

- `{ orderId: number }` は **オブジェクトではなく「オブジェクトの形を表す型」**。実物はない＝「間取り図」。
- 見分け方：中身が `number` なら型、`1234` なら値。
- だから `UseMutationOptions<void, Error, { orderId: number }>` は **「型・型・型」** を渡しているだけで、値は1つも入っていない。

```ts
type Vars = { orderId: number };       // 設計図（型）
const v   = { orderId: 1234 };         // 実物（値）。Vars に適合
mutate({ orderId: 1234 });  // ✅
mutate({ orderId: "abc" }); // ❌ string は number でない
mutate({ id: 1234 });       // ❌ orderId が無い
```

---

## 4. react-query.ts の3つの型ユーティリティ（実例）

共通の狙い: **fetcher 関数を single source of truth にして、型を二度書かない**。

### `ApiFnReturnType<FnType>` — 戻り値の中身（＝ `await` の型版）

```ts
export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

// getOrder: () => Promise<OrderDetail>
ApiFnReturnType<typeof getOrder>
// = Awaited<ReturnType<typeof getOrder>>
// = Awaited<Promise<OrderDetail>>
// = OrderDetail
```

### `QueryConfig<T>` — queryOptions から `queryKey`/`queryFn` を除いた残り

```ts
export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  "queryKey" | "queryFn"
>;
```

- `queryKey`/`queryFn` は **フックが内部で決める** → 呼び出し側に触らせない（`Omit` でフタ）
- 残った `staleTime` `enabled` などだけ、呼び出し側が型安全に上書きできる

```
{ queryKey, queryFn, staleTime?, enabled?, ... }
   │ Omit で queryKey・queryFn を除外
   ▼
{ staleTime?, enabled?, ... }
```

### `MutationConfig<MutationFnType>` — fetcher から `UseMutationOptions` を組み立てる

```ts
export type MutationConfig<MutationFnType extends (...args: any) => Promise<any>> =
  UseMutationOptions<
    ApiFnReturnType<MutationFnType>,  // ① 成功 data の型
    Error,                            // ② エラーの型
    Parameters<MutationFnType>[0]     // ③ mutate() に渡す引数の型
  >;

// cancelOrder: (vars: { orderId: number }) => Promise<void>
MutationConfig<typeof cancelOrder>
// = UseMutationOptions<void, Error, { orderId: number }>
```

| 穴 | 計算 | 結果 |
|---|---|---|
| ① TData | `ApiFnReturnType<typeof cancelOrder>` | `void` |
| ② TError | 固定 | `Error` |
| ③ TVariables | `Parameters<typeof cancelOrder>[0]` | `{ orderId: number }` |

→ `cancelOrder` 1個から、`onSuccess` の引数も `mutate({ orderId })` の引数も全部自動で型付けされる。

---

## 5. まとめ表

| 型関数 | 入力 | 出力 | ひとこと |
|---|---|---|---|
| `ReturnType<F>` | 関数 | 戻り値の型 | 戻り値を抽出 |
| `Awaited<T>` | Promise | 中身 | `await` の型版 |
| `Omit<T, K>` | オブジェクト型 | K を除いた型 | 「これ以外」 |
| `Pick<T, K>` | オブジェクト型 | K だけの型 | 「これだけ」 |
| `Parameters<F>[0]` | 関数 | 第1引数の型 | 引数を抜き出す |
| `ApiFnReturnType` | async 関数 | 戻り値の中身 | `Awaited<ReturnType<>>` |
| `QueryConfig` | queryOptions 関数 | key/fn 以外 | 上書きできる余地だけ |
| `MutationConfig` | mutation 関数 | UseMutationOptions | fetcher から3型引数を生成 |

**結論:** 型にも「関数」がある。`<T>` が引数、`=` の右が戻り値。全部コンパイル時に計算されて実行時には消える。これが分かるとジェネリクス全般が読めるようになる。
