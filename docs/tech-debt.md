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

### 見送り理由

7月リリースに向けてスコープを絞るため、今サイクルは見送り。現状の実装で機能上の問題はない。

### 対応時の考慮点

- 全フック（`useAdmProducts`, `useAdmProduct`, `useProduct`, `useProducts` 等）を一括で移行する
- ローディング・エラー状態の管理が簡略化される
- キャッシュにより同一データの重複フェッチが削減される
