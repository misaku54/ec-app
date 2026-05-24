# 商品一覧画面（お客様向け）コンポーネント設計雛形

## Atomic Design 構成

- **atoms**
  - ProductImage
  - PriceTag
  - AddToCartButton
- **molecules**
  - ProductCard（画像＋商品名＋価格＋カートボタン）
  - SearchBox
- **organisms**
  - ProductList（ProductCard のリスト）
  - Pagination
  - FilterPanel
- **templates**
  - ProductListTemplate（検索・フィルタ・リスト・ページネーションの組み合わせ）
- **pages**
  - CustomerProductListPage

## データフロー例

- API: `/api/products?name=xxx&minPrice=xxx&maxPrice=xxx&page=1`
- レスポンス例:
```json
{
  "status": "success",
  "data": [
    { "id": 1, "name": "商品A", "price": 1200, "imageUrl": "/images/a.jpg" },
    { "id": 2, "name": "商品B", "price": 980, "imageUrl": "/images/b.jpg" }
  ],
  "total": 100
}
```

## 参考
- hooks: `useAllProducts.ts` のパターンを流用
- レイアウト: `ProductManegement.tsx` のリスト部品を参考

---

この雛形をもとに、まずは `ProductCard` と `ProductList` から作るといいよ。