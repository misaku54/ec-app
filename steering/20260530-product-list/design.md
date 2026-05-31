# お客様向け商品一覧・詳細 詳細設計書（フロントエンド）

## 概要

お客様が商品を閲覧し、カートに追加するための画面。  
認証済みユーザー（USER・ADMIN）のみ利用可能。

---

## 画面設計

### URL

| 画面 | URL |
|---|---|
| 商品一覧 | `/products` |
| 商品詳細 | `/products/:id` |

---

### 商品一覧（`/products`）

#### レイアウト

```
┌─────────────────────────────────────────────┐
│ [名前検索      ] [最小価格] [最大価格] [在庫あり□] [検索] │
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

#### 商品カード仕様

カードクリックで詳細ページへ遷移。一覧からの直接カート追加はしない。

| 状態 | 表示 |
|---|---|
| 在庫あり | 商品画像・商品名・価格 |
| 在庫切れ | 商品画像・商品名・価格・「在庫切れ」ラベル |

#### 検索・フィルタ項目

| 項目 | パラメータ | 型 | 備考 |
|---|---|---|---|
| 商品名 | `name` | string | 部分一致 |
| 最小価格 | `minPrice` | number | 任意 |
| 最大価格 | `maxPrice` | number | 任意 |
| 在庫ありのみ | `inStock` | boolean | チェックボックス |

---

### 商品詳細（`/products/:id`）

#### レイアウト

```
┌───────────────────────────────────────┐
│ ┌──────────┐  商品名                   │
│ │          │  ¥X,XXX                  │
│ │  画像    │                           │
│ │ ギャラリー│  説明文                   │
│ │          │                           │
│ └──────────┘  数量: [1 ▼]             │
│               [カートに追加]            │
│                                       │
│  ※在庫切れの場合: [在庫切れ] ラベルのみ  │
└───────────────────────────────────────┘
```

#### 数量選択仕様

- 1〜在庫数の範囲でセレクトボックス表示
- カートにすでに同商品がある場合は**加算**する
  - 例: カートに3個 + 詳細で2個選択 → カートは5個

---

## 画面遷移

```
商品一覧（/products）
  └── 商品カードクリック → 商品詳細（/products/:id）
        └── 「カートに追加」 → カート状態更新（画面遷移なし）
```

---

## エラーハンドリング

| エラー種別 | 表示方法 |
|---|---|
| 商品一覧取得失敗 | トースト通知 |
| 商品詳細取得失敗（404含む） | トースト通知 + 一覧へ戻る |

---

## APIリクエスト

### GET /api/public/product/list

**クエリパラメータ:**

```
name=キーワード&minPrice=100&maxPrice=5000&inStock=true&page=1&size=20
```

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
    "total": 100,
    "pages": 5,
    "pageNum": 1,
    "pageSize": 20
  }
}
```

### GET /api/public/product/:id

※ 既存の `useSelectProduct` フックが `/api/public/product/{id}` を叩いている。詳細ページはこれを流用する。

---

## 実装クラス構成

```
frontend/src/
  components/
    pages/
      ProductListPage.tsx        # 商品一覧ページ
      ProductDetailPage.tsx      # 商品詳細ページ（お客様向け）
    organisms/
      ProductSearchForm.tsx      # 検索・フィルタフォーム
      ProductCardList.tsx        # 商品カード一覧
    molecules/
      ProductCard.tsx            # 商品カード1枚

  hooks/
    useProducts.ts               # 公開商品一覧取得（/api/public/product/list）
                                 # getProducts(page, searchForm?: SearchForm)

  types/
    Product.ts                   # 既存（流用）。productImageList: ImageData[] を追加
    Form.ts                      # SearchForm 型を追加
```

---

## カート追加ロジック

現在の `useCartStore.addItem` は1個固定で加算する実装。  
詳細ページで数量選択に対応するため、`addItem` を修正して指定個数を加算できるようにする。

**修正前:**
```ts
addItem: (item: CartItem) =>
  set((state) => {
    const idx = state.cart.findIndex((i) => i.productId === item.productId);
    if (isInCart) {
      newCart[idx] = { ...newCart[idx], count: newCart[idx].count + 1 };  // 固定で+1
    }
    return { cart: [...state.cart, { ...item, count: 1 }] };
  }),
```

**修正後:**
```ts
addItem: (item: CartItem, quantity: number = 1) =>
  set((state) => {
    const idx = state.cart.findIndex((i) => i.productId === item.productId);
    if (isInCart) {
      newCart[idx] = { ...newCart[idx], count: newCart[idx].count + quantity };  // 指定個数を加算
    }
    return { cart: [...state.cart, { ...item, count: quantity }] };
  }),
```

---

## 未対応事項（スコープ外）

- カテゴリ・タグによる絞り込み
- 並び替え（価格順・新着順）
- お気に入り機能
- 商品レビュー
