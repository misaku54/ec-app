# トースト通知の実装で学んだこと

## 実装箇所
`frontend/src/components/templates/DefaultLayout.tsx`

---

## 1. DefaultLayout はネストルート遷移でアンマウントされない

```
<Route path="/admin/product" element={<DefaultLayout />}>
  <Route path="list" element={<ProductManegement />} />
  <Route path=":id" element={<ProductDetail />} />
</Route>
```

- `list` → `:id` に遷移しても DefaultLayout は**マウントされたまま**
- `useEffect(fn, [])` は最初の1回しか実行されない
- ナビゲートのたびに実行させるには依存配列に `location` を入れる必要がある

```tsx
// NG
useEffect(() => { ... }, []);

// OK
useEffect(() => { ... }, [location, navigate]);
```

---

## 2. 戻る・進む・リロードでトーストが再表示される問題

`location.state` はブラウザの**履歴エントリに紐づいて残り続ける**。  
対策：トーストを表示した直後に `replace: true` で state をクリアする。

```tsx
navigate(location.pathname, { replace: true, state: null });
```

- `replace: true` は履歴に新しいエントリを追加せず**現在のエントリを上書き**する
- state が null になるため、戻る→進む・リロードしても再表示されない

---

## 3. オプショナルチェーンで安全なプロパティアクセス

```tsx
// NG: state がオブジェクトでも message がない場合に undefined が渡る
if (location.state != null) {
  toast.success(location.state.message);
}

// OK: state と message の両方を一度にチェック
if (location.state?.message) {
  toast.success(location.state.message);
  navigate(location.pathname, { replace: true, state: null });
}
```

---

## トーストを呼び出す側の書き方

```tsx
navigate(`/admin/product/${id}`, {
  state: { message: "商品を登録しました" },
});
```
