# 技術的負債・将来の改善メモ

今後の開発サイクルで対応を検討する事項をまとめる。

---

## APIフック設計: react-query の未導入

### 現状

`useProducts.ts` をはじめ、各APIフックは `useState` + axios の手動管理で統一されている。

```ts
const [products, setProducts] = useState<Product[]>([]);
const getProducts = (page) => {
  axiosInstance.get(...).then((res) => setProducts(res.data.data));
};
```

### bulletproof-react が推奨するアプローチ

- `react-query`（TanStack Query）でサーバーキャッシュを管理
- fetcher 関数と hook を分離する

```ts
// fetcher
export const getProducts = (params) => api.get('/api/public/product/list', { params });

// hook
export const useProducts = (params) => useQuery({
  queryKey: ['products', params],
  queryFn: () => getProducts(params),
});
```

### 方針（2026-06-10 更新）

**新規 API は react-query を採用、既存 API はそのまま** のハイブリッド運用に切り替え。
注文履歴（`features/orders/`）から bulletproof-react パターン（`src/features/<feature>/api/` に
fetcher + queryOptions + フックを同居）で実装する。

### 既存 API の段階移行

- 既存フック（`useAdmProducts` / `useAdmProduct` / `useProduct` / `useProducts` 等）は当面据え置き
- 機能追加・大きな改修の機会に合わせて、その feature 単位で react-query に置き換える
- `useAxios` は `lib/api-client.ts` への一本化が望ましい。`useAxios` 経由のフックを移行するときに合わせて廃止

### react-query 導入の利点

- ローディング・エラー状態の管理が簡略化される
- キャッシュにより同一データの重複フェッチが削減される
- mutation 後の invalidate でデータ整合性が保ちやすい
