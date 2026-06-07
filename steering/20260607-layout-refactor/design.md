# 管理画面・顧客画面のレイアウト分離 詳細設計書

## 概要

現状、管理画面と顧客画面が同じ `DefaultLayout` / `Header` を共用しており、動線として不整合な表示が発生している。これを役割ごとにレイアウトを分離し、ユーザーの権限と画面の目的に沿った動線に整える。

---

## 現状の動線の問題点

### ルーティング構造（現状）

```
PrivateRoute
├── AdminRoute
│   └── DefaultLayout                ← 管理者用に使用
│       ├── /admin/products
│       ├── /admin/products/:id
│       └── /admin/products/create
└── DefaultLayout                    ← 顧客用に使用（同じ Layout）
    ├── /products
    ├── /products/:id
    ├── /cart
    ├── /checkout
    └── /order/complete/:orderId
```

両ルートで同じ `DefaultLayout` → `Header` を使っているため、Header の中身が全画面で同じ表示になっている。

### Header の不整合（`components/organisms/Header.tsx`）

| 問題 | 症状 | 影響 |
|---|---|---|
| ブランド表記が `Admin \| STORE` の固定文字列 | 顧客画面でも「Admin」と表示される | 顧客が混乱する |
| カートアイコンが常に表示 | 管理画面でもカートアイコンが見える（クリックで `/cart` へ遷移可） | **管理者には不要な機能が露出** |
| 「商品管理」リンクが常に表示 | 顧客画面でも管理用ナビが見える | 顧客が混乱する／権限外操作を試みる |
| ロゴ `<a>` に `href` がない | クリックしても何も起こらない | ホームに戻れない |
| 「商品管理」`<a>` に `href` がない | クリックしても何も起こらない | 管理者すら遷移できない |
| 顧客向けナビが存在しない | 顧客は「商品一覧」へ戻る手段がカートアイコン以外にない | 動線が貧弱 |

### その他の細かい不整合

- `AdmProductDetail.tsx` のローディング表示が直書き（`"読み込み中..."`）。他ページは `Loader` コンポーネントを使用しており、表現が不揃い
- `AdmProductDetail.tsx` の `useEffect(() => selectProduct(id), [])` の依存配列が空で、`id` の変更に追従しない（`ProductDetailPage` は `[id]` で正しい）

---

## 設計方針

1. **管理画面と顧客画面で Layout を分離する**
   - `AdmDefaultLayout` + `AdmHeader`（管理者用）
   - `CustomerDefaultLayout` + `CustomerHeader`（顧客用）
   - 共通のトースト処理・`Footer` は templates 側のロジックとして再利用
2. **Header は画面の目的に必要なナビゲーションだけ提供する**
   - 管理者用：商品管理リンクのみ。カート・購入動線は出さない
   - 顧客用：商品一覧リンク・カートアイコン。商品管理リンクは出さない
3. **`useAuth()` での実行時分岐は使わない**
   - ルーティング上で既に `AdminRoute` / `PrivateRoute` で権限境界を引いている
   - レイアウトを分けることで「画面の役割」と「表示要素」が一致する
4. **ロゴ・ナビゲーションは `Link` に統一する**
   - `<a>` の href なし運用をやめ、`react-router` の `Link` で書く

---

## 改善後のルーティング構造

```
PrivateRoute
├── AdminRoute
│   └── AdmDefaultLayout              ← 管理者専用 Layout
│       ├── /admin/products
│       ├── /admin/products/:id
│       └── /admin/products/create
└── CustomerDefaultLayout             ← 顧客専用 Layout
    ├── /products
    ├── /products/:id
    ├── /cart
    ├── /checkout
    └── /order/complete/:orderId
```

---

## Header 設計

### AdmHeader（管理者用）

| 要素 | 内容 |
|---|---|
| ブランド | `[Admin] STORE` ロゴ（`Link to="/admin/products"`） |
| ナビ | `商品管理` (`/admin/products`) |
| 右側 | ログアウトボタン |
| 表示しない | カートアイコン、顧客向けナビ |

### CustomerHeader（顧客用）

| 要素 | 内容 |
|---|---|
| ブランド | `STORE` ロゴ（`Link to="/products"`） |
| ナビ | `商品一覧` (`/products`) |
| 右側 | カートアイコン（バッジ付き）、ログアウトボタン |
| 表示しない | 商品管理リンク |

---

## ファイル構成

凡例: ✅ 既存（修正） / 🆕 新規

```
frontend/src/components/
  templates/
    DefaultLayout.tsx                ✅ 削除候補（顧客用へリネーム）or 共通フックに集約
    AdmDefaultLayout.tsx             🆕 管理者用レイアウト
    CustomerDefaultLayout.tsx        🆕 顧客用レイアウト（旧 DefaultLayout の役割）
  organisms/
    Header.tsx                       ✅ 削除（2分割）
    AdmHeader.tsx                    🆕 管理者用ヘッダー
    CustomerHeader.tsx               🆕 顧客用ヘッダー
  pages/
    AdmProductDetail.tsx             ✅ Loader 適用、useEffect 依存配列に `id` を追加
  router/
    Router.tsx                       ✅ Layout 差し替え
```

### 共通化の指針

`DefaultLayout` の以下のロジックは両 Layout で共通化が必要：

- `location.state.message` を拾ってトースト表示し state をクリアする処理
- `min-h-screen bg-zinc-50 flex flex-col` のラッパ
- `<main>` のレイアウト
- `<Footer />`

選択肢：

- **A. 共通の `BaseLayout` を作って Header を children/prop で差し替える**
- **B. それぞれの Layout に同じロジックをコピペする**

責務分離・DRY の観点から **A 案を推奨**。Header だけ差し替える薄いラッパとして実装する。

```tsx
// BaseLayout.tsx（概念）
type Props = { header: ReactNode };
export const BaseLayout = ({ header }: Props) => {
  // location.state のトースト処理
  return (
    <div className="...">
      {header}
      <main>...<Outlet /></main>
      <Footer />
    </div>
  );
};

// AdmDefaultLayout.tsx
export const AdmDefaultLayout = () => <BaseLayout header={<AdmHeader />} />;

// CustomerDefaultLayout.tsx
export const CustomerDefaultLayout = () => <BaseLayout header={<CustomerHeader />} />;
```

---

## 実装タスク

1. **`templates/BaseLayout.tsx` を新規作成**
   - 既存 `DefaultLayout` のロジックを移植
   - `header: ReactNode` を props として受け取る
2. **`organisms/AdmHeader.tsx` を新規作成**
   - 現 `Header.tsx` をベースに、カート・顧客向け要素を削除
   - ロゴと「商品管理」を `Link` に置き換え
3. **`organisms/CustomerHeader.tsx` を新規作成**
   - ブランドは「STORE」のみ
   - ナビは「商品一覧」(`Link to="/products"`)
   - カートアイコン（現 Header から移植）+ ログアウト
4. **`templates/AdmDefaultLayout.tsx` / `CustomerDefaultLayout.tsx` を新規作成**
   - `BaseLayout` のラッパ
5. **`router/Router.tsx` を修正**
   - 管理者ルートは `AdmDefaultLayout`、顧客ルートは `CustomerDefaultLayout` を使用
6. **`pages/AdmProductDetail.tsx` のメンテ**
   - ローディング表示を `<Loader />` に統一
   - `useEffect` の依存配列を `[id]` に修正
7. **`templates/DefaultLayout.tsx` / `organisms/Header.tsx` を削除**

---

## スコープ外

- 認証画面（`/login` `/register`）のレイアウト見直し（現状 Layout 未適用なのでそのまま）
- ヘッダーのレスポンシブ崩れの修正
- フッターのリンク追加
- 顧客向けの追加ナビ（お気に入り・注文履歴など）
