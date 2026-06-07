# お客様向け商品一覧・詳細 詳細設計書（フロントエンド）

## 概要

お客様が商品を閲覧し、カートに追加するための画面（一覧・詳細）。
認証済みユーザー（USER・ADMIN）のみ利用可能。

本設計は今後のサンプル実装として保守性・可読性を重視する。

---

## 設計方針

1. **責務分離**
   - ページコンポーネントは「データ取得のトリガー」「子への配線」のみを行う
   - URL ↔ 検索条件の変換はカスタムhookに閉じ込める
   - S3 画像URL生成は util に集約し、コンポーネントからベースURLを排除する
2. **状態の単一の源は URL**
   - 検索条件・ページ番号は `useSearchParams` のみで保持する
   - リロード・ブラウザバック・URL共有に自然対応
3. **見た目とロジックの分離**
   - 検索フォームは表示と入力ハンドリングのみ。検索実行後の挙動（page=1 リセット等）は呼び出し側で決める
4. **カート関連の責務はカート画面に集約**
   - 詳細ページからのカート操作は「1個追加」だけに留める
   - 数量変更・削除はカート画面で行う（既存実装を流用）

---

## 画面設計

### URL

| 画面 | URL |
|---|---|
| 商品一覧 | `/products` |
| 商品詳細 | `/products/:id` |

### 商品一覧（`/products`）

#### レイアウト

```
┌─────────────────────────────────────────────┐
│ [名前検索] [最小価格] [最大価格] [在庫あり□] [検索] │
├─────────────────────────────────────────────┤
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐                │
│ │画像│ │画像│ │画像│ │画像│                │
│ │    │ │    │ │    │ │在庫│                │
│ │    │ │    │ │    │ │切れ│                │
│ │商品名│ │商品名│ │商品名│ │商品名│              │
│ │¥XXX│ │¥XXX│ │¥XXX│ │¥XXX│               │
│ └────┘ └────┘ └────┘ └────┘                │
├─────────────────────────────────────────────┤
│             < 1 2 3 ... >                   │
└─────────────────────────────────────────────┘
```

- 商品カードクリックで詳細ページへ遷移。一覧からの直接カート追加はしない
- 商品0件時は「該当する商品はありません」を表示

#### 商品カード仕様

| 状態 | 表示 |
|---|---|
| 在庫あり | 画像・商品名・価格 |
| 在庫切れ | 画像・商品名・価格・「在庫切れ」ラベル |

#### 検索・フィルタ項目

| 項目 | パラメータ | 型 | 備考 |
|---|---|---|---|
| 商品名 | `name` | string | 部分一致 |
| 最小価格 | `minPrice` | number | 任意 |
| 最大価格 | `maxPrice` | number | 任意 |
| 在庫ありのみ | `inStock` | boolean | チェックボックス。`true` の時だけURLに付与 |

---

### 商品詳細（`/products/:id`）

#### レイアウト

```
┌─────────────────────────────────────────┐
│ ┌──────────┐                            │
│ │          │  商品名                    │
│ │  メイン  │  ¥X,XXX                    │
│ │  画像    │                            │
│ │          │  説明文                    │
│ └──────────┘                            │
│ [小1][小2][小3]                         │
│                                         │
│              [カートに追加]              │
│                                         │
│  ※在庫切れの場合:                       │
│   ・「在庫切れ」ラベル                  │
│   ・カート追加ボタンは非表示             │
└─────────────────────────────────────────┘
```

#### カート追加仕様

- ボタンクリックで `useCartStore.addItem(product)` を呼ぶ
- カートに既に同商品があれば**個数+1**（既存 `addItem` の挙動）
- 詳細ページに数量セレクトは置かない。**数量変更はカート画面で行う**
- 追加成功時はトースト通知で「カートに追加しました」

#### 在庫切れ表示

`product.stock === 0` のとき：
- `AddToCartButton` がボタンの代わりに「在庫切れ」ラベルを表示（ボタン非表示と兼用）
- 価格・画像・説明は通常通り表示

#### エラーハンドリング

| エラー | 挙動 |
|---|---|
| 取得失敗（404・5xx 等すべて） | `/products` へ navigate し、state 経由でエラーメッセージを `DefaultLayout` に渡してトースト表示 |

詳細ページに留まっても再試行 UI が無く、空のページを表示し続ける意味が薄いため、エラー種別で挙動を分けない設計とする。

---

## ファイル構成と実装状況

凡例: ✅ 完了 / 🔶 部分実装 / ❌ 未着手

```
frontend/src/
  components/
    pages/
      ProductListPage.tsx          ✅ 一覧。描画と配線のみ
      ProductDetailPage.tsx        ✅ ローディング・null・本体の3状態を出し分け
    organisms/
      ProductSearchForm.tsx        ✅ react-hook-form。defaultValues で URL 復元対応
      ProductCardList.tsx          ✅ 商品カードのグリッド表示
      ProductDetailContent.tsx     ✅ 画像ギャラリー + 商品情報 + AddToCartButton を配置
    molecules/
      ProductCard.tsx              ✅ 商品カード1枚
      ProductImageList.tsx         ✅ 既存。管理画面側で使用
      ProductImageGallery.tsx      ✅ 詳細画面用ギャラリー（サムネイル切替）
    atoms/
      button/
        AddToCartButton.tsx        ✅ CartItem 受け取り。追加時にトースト通知（内蔵）
      ProductImage.tsx             ✅ 既存。1枚の画像（onError フォールバック）
  hooks/
    useProducts.ts                 ✅ 公開商品一覧取得
    useProduct.ts                  ✅ 公開商品詳細取得（エラー時は `/products` へ navigate + state でメッセージ伝達）
    useProductSearchParams.ts      ✅ URL ↔ SearchForm/page 変換
  stores/
    useCartStore.ts                ✅ 既存。addItem を再利用
  utils/
    productImageUrl.ts             ✅ S3 画像URL生成
  types/
    Product.ts                     ✅ 既存流用
    ProductDetail.ts               ✅ 既存流用（画像リスト込みの型）
    Form.ts                        ✅ SearchForm（inStock は boolean）
    Cart.ts                        ✅ CartItem 型
  router/
    Router.tsx                     ✅ `/products/:id` を顧客側 Layout 配下に追加済み
```

---

## 詳細画面の実装方針（実装済み）

### 画像ギャラリー (`ProductImageGallery`)

- `molecules/` 配下に新規作成（既存 `ProductImageList` は管理画面が使用しているため流用せず）
- メイン画像 + サムネイル列の構成
- メイン画像の決定ロジック: `mainImage === true` を優先、なければ先頭、画像なしなら `null`
- サムネイル選択は内部 state (`mainKey`) で保持
- 選択中サムネイルは `border-zinc-800` でハイライト

### カート追加 (`AddToCartButton` 接続)

- `ProductDetailContent` 内で `ProductDetail` → `CartItem` (5フィールド) に変換し props で渡す
- トースト通知は `AddToCartButton` 内で完結（`toast.success("カートに追加しました。")` を直接呼ぶ）
  - 親からコールバックを渡す方式は採用せず。「カート追加成功時はトースト」という挙動が `AddToCartButton` 単体で完結している方がシンプル

### 在庫切れ表示

- 「在庫切れ」ラベルは `AddToCartButton` 側で在庫0時に表示する形に統合
- 設計書当初の「`ProductDetailContent` 側で在庫切れラベル」は不採用（ボタンと重複するため）

---

## 状態管理

### useProductSearchParams（一覧用）

```
URL: /products?page=2&name=シャツ&minPrice=1000

       ┌────────────────────────────────┐
       │     useProductSearchParams     │
       ├────────────────────────────────┤
URL ──▶│ page: number                   │
       │ searchForm: SearchForm         │
       │ setSearch(form)  → page=1 で更新│
       │ setPage(n)       → 条件を維持   │
       └────────────────────────────────┘
```

`ProductListPage` は `useEffect([page, searchForm])` で `getProducts` を呼ぶだけ。
URL が変わると hook の戻り値が更新され、副作用として API が走る。

### useProduct（詳細用）

```
       ┌────────────────────────────────┐
       │           useProduct           │
       ├────────────────────────────────┤
id ──▶│ product: ProductDetail | null  │
       │ isLoading: boolean             │
       │ getProduct(id)                 │
       └────────────────────────────────┘
```

`ProductDetailPage` が `useParams` で `id` を取得し、`useEffect([id])` で `getProduct` を呼ぶ。

### 値の解釈ルール（検索）

| URL                   | searchForm の値                |
|-----------------------|-------------------------------|
| `?name=シャツ`         | `name: "シャツ"`               |
| なし                   | `name: null`                  |
| `?minPrice=1000`      | `minPrice: 1000`              |
| `?minPrice=`（空）     | `minPrice: null`              |
| `?inStock=true`       | `inStock: true`               |
| なし or `inStock=false`| `inStock: false`              |

`searchForm` は `useMemo` で `searchParams.toString()` を依存に持たせ、参照を安定させる。

---

## API

### GET /api/public/product/list

**クエリパラメータ:**

```
name=...&minPrice=...&maxPrice=...&inStock=true&page=1&size=20
```

`useProducts.getProducts(page, searchForm)` が値が存在するパラメータだけを送る。

**レスポンス:**

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "商品名",
      "description": "説明",
      "price": 1000,
      "stock": 5,
      "productImageList": [{ "s3Key": "...", "sortOrder": 1, "mainImage": true }],
      "createdAt": "2026-05-01T00:00:00",
      "updatedAt": "2026-05-01T00:00:00"
    }
  ],
  "pageInfo": {
    "totalCount": 100,
    "totalPage": 5,
    "currentPage": 1,
    "size": 20
  }
}
```

### GET /api/public/product/:id

**レスポンス:**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "商品名",
    "description": "説明",
    "price": 1000,
    "stock": 5,
    "productImageList": [
      { "s3Key": "PRODUCT/1/product_0.png", "sortOrder": 0, "mainImage": true },
      { "s3Key": "PRODUCT/1/product_1.png", "sortOrder": 1, "mainImage": false }
    ],
    "createdAt": "2026-05-01T00:00:00",
    "updatedAt": "2026-05-01T00:00:00"
  }
}
```

存在しない / 削除済みの場合: 404 を返す。

---

## 画像URL生成

`utils/productImageUrl.ts` に集約。コンポーネントからベースURLのハードコードを排除する。

```ts
buildProductImageUrl(s3Key)  // s3Key が null/undefined のときは NO_IMAGE_URL
NO_IMAGE_URL                 // onError フォールバック用
```

---

## エラーハンドリング

| エラー種別 | 表示方法 |
|---|---|
| 商品一覧取得失敗 | トースト通知（ページに留まる） |
| 商品詳細取得失敗（404・5xx 等すべて） | `/products` へ navigate + state 経由でメッセージを `DefaultLayout` に渡してトースト表示 |
| 画像読み込み失敗 | `onError` で `NO_IMAGE_URL` にフォールバック |

---

## 画面遷移

```
商品一覧（/products）
  └── 商品カードクリック → 商品詳細（/products/:id）
        └── 「カートに追加」 → カート状態を更新（画面遷移なし、トースト通知）
              └── ヘッダーのカートアイコンからカート画面へ
```

---

## 未対応事項（スコープ外）

- カテゴリ・タグによる絞り込み
- 並び替え（価格順・新着順）
- お気に入り機能
- 商品レビュー
- 商品詳細での数量指定追加（カート画面で調整する設計）
