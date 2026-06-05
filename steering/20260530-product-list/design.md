# お客様向け商品一覧 詳細設計書（フロントエンド）

## 概要

お客様が商品を閲覧し、カートに追加するための画面。
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

## ファイル構成

```
frontend/src/
  components/
    pages/
      ProductListPage.tsx          # 描画と配線のみ。検索状態は useProductSearchParams に委譲
    organisms/
      ProductSearchForm.tsx        # react-hook-form。defaultValues で URL 復元対応
      ProductCardList.tsx          # 商品カードのグリッド表示
    molecules/
      ProductCard.tsx              # 商品カード1枚（Product 型を直接受け取る）
  hooks/
    useProducts.ts                 # 公開商品一覧取得（既存）
    useProductSearchParams.ts      # URL ↔ SearchForm/page 変換（新規）
  utils/
    productImageUrl.ts             # S3 画像URL生成（新規）
  types/
    Product.ts                     # 既存流用
    Form.ts                        # SearchForm（inStock は boolean）
```

---

## 状態管理

### useProductSearchParams

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

### 値の解釈ルール

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
| 商品一覧取得失敗 | トースト通知 |
| 画像読み込み失敗 | `onError` で `NO_IMAGE_URL` にフォールバック |

---

## 画面遷移

```
商品一覧（/products）
  └── 商品カードクリック → 商品詳細（/products/:id）
```

---

## 未対応事項（スコープ外）

- カテゴリ・タグによる絞り込み
- 並び替え（価格順・新着順）
- お気に入り機能
- 商品レビュー
- 商品詳細ページのリファクタ（本設計は商品一覧のみを対象）
