# 注文履歴（会員向け）詳細設計書

## 概要

ログイン済みの会員（USER/ADMIN）が自分の注文履歴を閲覧し、状況に応じて注文をキャンセルできる機能。

---

## 設計方針

1. **権限境界**
   - `/api/customer/order/*` の各エンドポイントは認証済みユーザーのみ
   - 注文詳細・キャンセルは `account_id` がログインユーザーと一致する場合のみ操作可能。他人の注文へのアクセスは 404
2. **サーバー状態は react-query のキャッシュで管理**
   - 一覧・詳細は `useQuery` で取得 + キャッシュ（`staleTime: 60s`）
   - キャンセル成功時は `invalidateQueries({ queryKey: ['orders'] })` で一覧・詳細両方を再取得
   - 「DBが正、フロントはキャッシュ」の関係は維持しつつ、ページ間遷移での重複フェッチを抑制する
3. **商品情報の表示**
   - **商品名・単価・数量**: `order_items` のスナップショットを使用（注文時点で固定）
   - **画像**: 現在の `products` マスタから取得。商品削除済み or 画像なしなら `NO_IMAGE_URL`
4. **キャンセルの責務はBEに集約**
   - フロントは「キャンセル可否」をレスポンスから判断するのではなく、`status === "PENDING"` のときだけボタンを表示する
   - BE側でも二重チェック（status != PENDING でキャンセル要求が来たら 400）
5. **ステータス更新（管理者向け）はスコープ外**
   - 3-5 で対応。本タスクではキャンセルのみ

---

## 画面設計

### URL

| 画面 | URL | 認証 |
|---|---|---|
| 注文履歴 | `/orders` | USER / ADMIN |
| 注文詳細 | `/orders/:id` | USER / ADMIN（自分の注文のみ） |

### 注文履歴（`/orders`）

#### レイアウト

```
┌─────────────────────────────────────────┐
│ 注文履歴                                │
├─────────────────────────────────────────┤
│ #1234   2026-06-07   ¥12,000   [PENDING]│
│   詳細を見る                            │
├─────────────────────────────────────────┤
│ #1233   2026-06-05   ¥3,400    [SHIPPED]│
│   詳細を見る                            │
├─────────────────────────────────────────┤
│             < 1 2 3 ... >               │
└─────────────────────────────────────────┘
```

- 注文0件時は「注文履歴がありません」
- 並び順: `created_at DESC`（新着順）
- ページネーション: 20件ずつ（PageHelper を使用）

### 注文詳細（`/orders/:id`）

#### レイアウト

```
┌─────────────────────────────────────────┐
│ ← 注文履歴へ戻る                       │
│                                         │
│ 注文番号: #1234                         │
│ 注文日: 2026-06-07 12:34                │
│ ステータス: PENDING （注文受付中）      │
│                                         │
│ [注文をキャンセル]  ※PENDING時のみ      │
├─────────────────────────────────────────┤
│ お届け先                                │
│   山田 太郎 様                          │
│   〒123-4567 東京都...                 │
│   090-1234-5678                         │
├─────────────────────────────────────────┤
│ 注文商品                                │
│ ┌──┐ 商品名A   ¥1,000 × 2 = ¥2,000     │
│ │画像│                                  │
│ └──┘                                    │
│ ┌──┐ 商品名B   ¥500   × 1 = ¥500       │
│ │画像│                                  │
│ └──┘                                    │
├─────────────────────────────────────────┤
│ 合計: ¥2,500                            │
└─────────────────────────────────────────┘
```

### ステータス表示

| status (DB) | 表示 |
|---|---|
| PENDING | 注文受付中 |
| CONFIRMED | 注文確定 |
| SHIPPED | 発送済み |
| DELIVERED | 配達完了 |
| CANCELLED | キャンセル済み |

`utils/orderStatus.ts` に変換関数 `formatOrderStatus(status)` を用意。

### キャンセル仕様

- `status === "PENDING"` のときのみキャンセルボタン表示
- ボタンクリックで確認ダイアログ（既存 `DiaLogContext` 流用）
- キャンセル成功時の挙動:
  1. トースト「注文をキャンセルしました」を表示
  2. **画面は詳細ページに留まる**（一覧に戻さない）
  3. `useCancelOrder` の `onSuccess` 内で `invalidateQueries({ queryKey: ['orders'] })` 発火 → 詳細キャッシュが無効化され、再 fetch でステータスが `CANCELLED` に更新される
  4. ステータスが `PENDING` でなくなるため、キャンセルボタンが自動的に消える
- キャンセル失敗時: トースト「キャンセルに失敗しました」。ボタンは活性に戻る（react-query が自動で `isPending: false`）
- BE側で在庫を戻す処理が必要

---

## API

### GET /api/customer/order/list

ログインユーザーの注文一覧（新着順、ページネーション）

**クエリパラメータ:**
```
page=1&size=20
```

**レスポンス:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1234,
      "totalAmount": 12000,
      "status": "PENDING",
      "createdAt": "2026-06-07T12:34:56"
    }
  ],
  "pageInfo": {
    "totalCount": 50,
    "totalPage": 3,
    "currentPage": 1,
    "size": 20
  }
}
```

### GET /api/customer/order/:id

注文詳細。`account_id` が一致しない場合は 404。

**レスポンス:**
```json
{
  "status": "success",
  "data": {
    "id": 1234,
    "totalAmount": 12000,
    "status": "PENDING",
    "shippingName": "山田 太郎",
    "shippingPostalCode": "123-4567",
    "shippingAddress": "東京都...",
    "shippingPhone": "090-1234-5678",
    "note": "...",
    "createdAt": "2026-06-07T12:34:56",
    "orderItems": [
      {
        "productId": 5,
        "productName": "商品名A",
        "unitPrice": 1000,
        "quantity": 2,
        "currentImageS3Key": "PRODUCT/5/product_0.png"
      }
    ]
  }
}
```

- `currentImageS3Key`: 現在の `products.product_images` から `mainImage = true` の s3Key。商品削除済みや画像なしなら `null`

### POST /api/customer/order/:id/cancel

注文キャンセル。

**事前条件:**
- 注文の `account_id` がログインユーザーと一致すること
- 注文の `status` が `PENDING` であること
- いずれかを満たさない場合は 400 / 404

**処理:**
- `orders.status` を `CANCELLED` に更新
- `order_items` の各商品の在庫を加算（注文時の減算を打ち消し）
- `updated_at` を現在時刻に

**レスポンス:**
```json
{ "status": "success" }
```

---

## ファイル構成

### BE

凡例: ✅ 完了 / 🔶 一部完了（cancel が未着手） / 🆕 新規（完了済み）

```
app/src/main/java/com/example/app/
  rest/
    OrderApi.java                    🔶 list / detail 完了。cancel 追加が必要
  service/
    OrderService.java                🔶 getOrderList / getOrderDetail 完了。cancelOrder 追加が必要
    impl/OrderServiceImpl.java       🔶 同上
  mapper/
    OrderMapper.java                 🔶 getOrderList / getOrderDetail 完了。updateOrderStatus / 在庫加算 が必要
  dto/
    OrderHistoryItemDto.java         🆕 一覧用 DTO
    OrderDetailDto.java              🆕 詳細用 DTO（OrderItem 込み）
    OrderItemDetailDto.java          🆕 詳細の orderItem 用 DTO（currentImageS3Key 込み）
app/src/main/resources/mapper/
  OrderMapper.xml                    🔶 list / detail の select 完了。updateOrderStatus が必要
```

### FE

既存の Atomic Design 構造（`atoms`/`molecules`/`organisms`/`pages`）はそのまま維持。
本機能から **react-query** と **bulletproof-react の API レイヤパターン**（fetcher + queryOptions + フックの3点セット）を導入する。
既存コード（products / cart / auth 等）は据え置きで、新規 API のみ react-query を使う**ハイブリッド運用**。

```
frontend/src/
  lib/
    api-client.ts                    🆕 react-query 用の独立 axios インスタンスを新設（既存 ApiClient / useAxios とは別物。interceptor は移植せず最小限に留める）
    react-query.ts                   🆕 QueryClient のデフォルト config + QueryConfig/MutationConfig 型ユーティリティ
  api/
    orders/
      get-orders.ts                  🆕 fetcher + getOrdersQueryOptions + useOrders（useQuery）
      get-order.ts                   🆕 fetcher + getOrderQueryOptions + useOrder（useQuery）
      cancel-order.ts                🆕 fetcher + useCancelOrder（useMutation + invalidate）
  components/
    pages/
      OrderListPage.tsx              🆕 注文履歴ページ
      OrderDetailPage.tsx            🆕 注文詳細ページ
      OrderCompletePage.tsx          ✅ 「注文履歴を見る」リンク追加
    organisms/
      OrderList.tsx                  🆕 一覧テーブル（useOrders を呼ぶ）
      OrderDetailContent.tsx         🆕 詳細表示（useOrder を呼ぶ）
      CustomerHeader.tsx             ✅ 「注文履歴」リンク追加
    molecules/
      CancelOrderButton.tsx          🆕 キャンセルボタン（useCancelOrder。PENDING時のみ表示）
    atoms/
      OrderStatusLabel.tsx           🆕 ステータスバッジ
  types/
    Order.ts                         🆕 OrderStatus / OrderHistoryItem / OrderDetail / OrderItemDetail
  utils/
    orderStatus.ts                   🆕 formatOrderStatus(status) — 日本語ラベル変換
  router/
    Router.tsx                       ✅ `/orders` `/orders/:id` 追加
```

**配置ルール:**

- API 関連（fetcher + queryOptions + フック）は `src/api/<resource>/` に集約。bulletproof-react の features 構成は今回は採用せず、API レイヤだけ分離
- 既存の `hooks/` には新規ファイルを増やさない（API 系は `api/` 配下に統一）
- `lib/` は app 全体で使う基盤コード（axios インスタンス、react-query 設定）

---

## 実装タスク

### BE

凡例: ✅ 完了 / ❌ 未着手

- ✅ **DTO 作成**: `OrderHistoryItemDto` / `OrderDetailDto` / `OrderItemDetailDto`
- ✅ **一覧/詳細の Mapper・Service・Controller**: `getOrderList(accountId)` / `getOrderDetail(orderId, accountId)`
- ✅ **404 ハンドリング**: 詳細の null 戻り → `ApiNotFoundException` → 404
- ❌ **キャンセル Mapper 追加**:
  - `updateOrderStatus(orderId, status)` — `orders.status` 更新
  - `incrementProductStock(productId, quantity)` — 在庫加算（既存 `updateProductStock` は減算用なので新規 or 引数で正負対応）
  - `selectOrderItemsByOrderId(orderId)` — キャンセル対象明細の取得（既存 detail SQL を流用可）
- ❌ **キャンセル Service 追加**: `cancelOrder(orderId, accountId)`
  - 注文取得 → 自分の注文か & status が PENDING かチェック
  - status を CANCELLED に更新
  - 各明細の商品の在庫を加算
  - `@Transactional` 必須
- ❌ **キャンセル Controller 追加**: `POST /api/customer/order/{orderId}/cancel`
- ❌ **キャンセル時のバリデーション**: 自分の注文でない → 404 / status != PENDING → 400

### FE（手順 — bulletproof-react 流）

#### 事前準備（共通基盤）

1. **依存追加**: `npm i @tanstack/react-query @tanstack/react-query-devtools`
2. **`lib/api-client.ts` 作成**（既存 `api/ApiClient.ts` / `useAxios` とは**別物の独立インスタンス**。既存コードには一切手を入れない）:
   ```ts
   // react-query 専用の独立 axios インスタンス。
   // baseURL は plan「すぐ対応すべき点」の環境変数化に合わせて env 参照（未設定時はローカルにフォールバック）。
   export const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8888',
     withCredentials: true,
   });

   api.interceptors.request.use((config) => {
     if (config.headers) config.headers.Accept = 'application/json';
     return config;
   });

   api.interceptors.response.use(
     (response) => response.data,  // ApiResponse<T> をそのまま返す（fetcher 側で型付け）
     (error) => Promise.reject(error),  // エラーは画面側でハンドリング（plan フェーズ4「テスト・品質向上」4-3 で interceptor 集約に置き換え予定）
   );
   ```
   - **方針**: interceptor は **最小限**に留める。「成功時の data 展開」のみ行い、エラー処理は画面側に委ねる（[エラーハンドリング](#エラーハンドリング) 参照）
   - bulletproof 本家は interceptor で共通トースト＋401リダイレクトを一元化しているが、**その一元化は plan のフェーズ4「テスト・品質向上」4-3「API エラーハンドリング統一」スコープ**（`repo/implementation-plan.md` 225〜230行目）。本タスクでは暫定的に画面側で処理し、フェーズ4-3 で interceptor 集約 / ErrorBoundary に移行する
   - 401 のグローバル処理は現状の `PrivateRoute` パターンに任せる（interceptor で特別処理しない）
   - `useAxios` の 401/403 navigate ロジックは**移植しない**（独立インスタンスの分離を崩さないため）
3. **`lib/react-query.ts` 作成**:
   ```ts
   export const queryConfig = {
     queries: {
       refetchOnWindowFocus: false,
       retry: false,
       staleTime: 60 * 1000,
     },
   } satisfies DefaultOptions;

   export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
     Awaited<ReturnType<FnType>>;

   export type QueryConfig<T extends (...args: any[]) => any> = Omit<
     ReturnType<T>,
     'queryKey' | 'queryFn'
   >;

   export type MutationConfig<
     MutationFnType extends (...args: any) => Promise<any>,
   > = UseMutationOptions<
     ApiFnReturnType<MutationFnType>,
     Error,
     Parameters<MutationFnType>[0]
   >;
   ```
4. **QueryClientProvider 設置**: `App.tsx` のルートで `<QueryClientProvider client={queryClient}>` で全体を包む。`queryClient` は `lib/react-query.ts` の `queryConfig` で生成
5. **DevTools の組み込み**（任意・開発時のみ）: `<ReactQueryDevtools />`

#### orders 機能の実装

6. **`types/Order.ts`**:
   ```ts
   export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
   export type OrderHistoryItem = { id: number; status: OrderStatus; totalAmount: number; createdAt: string };
   export type OrderItemDetail = { productId: number; productName: string; unitPrice: number; quantity: number; currentImageS3Key: string | null };
   export type OrderDetail = { id: number; status: OrderStatus; totalAmount: number; shippingName: string; shippingPostalCode: string; shippingAddress: string; shippingPhone: string | null; note: string | null; createdAt: string; orderItems: OrderItemDetail[] };
   ```
7. **`utils/orderStatus.ts`**: `formatOrderStatus(status: OrderStatus): string` を export
8. **`api/orders/get-orders.ts`**（パターン: fetcher + queryOptions + フック）:
   ```ts
   // size は BE 側のデフォルト（20）を使用。可変にする要件が出たら fetcher 引数に追加
   export const getOrders = (page = 1): Promise<{ data: OrderHistoryItem[]; pageInfo: PageInfo }> =>
     api.get('/api/customer/order/list', { params: { page } });

   export const getOrdersQueryOptions = ({ page }: { page?: number } = {}) =>
     queryOptions({
       queryKey: page ? ['orders', { page }] : ['orders'],
       queryFn: () => getOrders(page),
     });

   export const useOrders = ({ page, queryConfig }: { page?: number; queryConfig?: QueryConfig<typeof getOrdersQueryOptions> } = {}) =>
     useQuery({ ...getOrdersQueryOptions({ page }), ...queryConfig });
   ```
9. **`api/orders/get-order.ts`**: 同様のパターンで詳細取得
10. **`api/orders/cancel-order.ts`**（mutation パターン）:
    ```ts
    export const cancelOrder = ({ orderId }: { orderId: number }) =>
      api.post(`/api/customer/order/${orderId}/cancel`);

    export const useCancelOrder = ({ mutationConfig }: { mutationConfig?: MutationConfig<typeof cancelOrder> } = {}) => {
      const queryClient = useQueryClient();
      const { onSuccess, ...rest } = mutationConfig ?? {};
      return useMutation({
        onSuccess: (...args) => {
          // 詳細・一覧両方のキャッシュを無効化して再取得
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          onSuccess?.(...args);
        },
        ...rest,
        mutationFn: cancelOrder,
      });
    };
    ```
11. **コンポーネント**: `atoms/OrderStatusLabel` → `organisms/OrderList` → `organisms/OrderDetailContent` → `molecules/CancelOrderButton` の順に。組織化はそのままで、API系フックは `api/orders/` から import
12. **ページ**: `pages/OrderListPage.tsx` は `<OrderList />` を return するだけの薄いラッパ。`OrderDetailPage.tsx` も同様
13. **Router**: `/orders` `/orders/:id` を顧客側 Layout 配下に追加
14. **導線追加**: `CustomerHeader` / `OrderCompletePage`

---

## bulletproof-react パターンのポイント

### 1. API レイヤの3点セット

各 API ファイル（`get-orders.ts` 等）に以下を**同居**させる:

- **fetcher 関数**（`getOrders`）: 純粋関数。axios を叩くだけ
- **queryOptions**（`getOrdersQueryOptions`）: queryKey + queryFn の組。prefetch 用に外部からも参照可能
- **フック**（`useOrders`）: `useQuery(queryOptions)` の薄いラッパ。`queryConfig` を受けて拡張可能

**利点:** 1ファイル見れば「呼び方」「キャッシュキー」「型」が全部わかる。tree-shaking も効く。

### 2. queryKey 設計

- 一覧: `['orders', { page }]`（ページ番号ごとにキャッシュ）
- 詳細: `['orders', orderId]`（個別のキャッシュ）
- mutation 後の invalidate: `['orders']` をプレフィックス指定で全部無効化

### 3. mutation の onSuccess チェーン

`useCancelOrder` 自体は基本的な invalidate のみ行い、UI 側の通知などは呼び出し側で `mutationConfig.onSuccess` で追加する。これによりフックは画面非依存に保てる。

```tsx
const cancelMutation = useCancelOrder({
  mutationConfig: {
    onSuccess: () => toast.success('注文をキャンセルしました'),
    onError: (e) => toast.error('キャンセルに失敗しました'),
  },
});
cancelMutation.mutate({ orderId: 1234 });
```

### 4. 既存パターンとの共存

- 既存の `useProducts` / `useCartStore` 等はそのまま動く
- 既存の `useAxios` フックは段階廃止候補（react-query は interceptor 経由でも問題ないので、`lib/api-client.ts` に統合）
- ただし**既存コードの useAxios を強制移行はしない**。新規だけ `api` を使う

### 5. 型の置き場所

- **リソース別の型**: 既存と同じく `src/types/Order.ts` に集約
- **app 横断の型**（PageInfo, ApiResponse など）: 既存の `src/types/` のまま
- features 構成は今回は採用しないため、型もリソース単位（1ファイル）にまとめる

---

## エラーハンドリング

### 役割分担

- **`lib/api-client.ts` の response interceptor**: 認証エラー（401）の処理のみ。それ以外はエラーをそのまま reject し、画面側に判断を委ねる
- **画面（ページコンポーネント）**: `useQuery`/`useMutation` の `error` を `useEffect` で監視し、トースト or navigate を発火する
- **`useQuery` フック自体（`useOrders` 等）**: エラー処理は持たない。画面非依存に保つ

### ケース別の挙動

| エラー | 場所 | 挙動 |
|---|---|---|
| 一覧取得失敗 (`OrderListPage`) | 画面側 `useEffect` | `toast.error('注文一覧の取得に失敗しました')`。ページに留まる |
| 詳細取得失敗 (`OrderDetailPage`) | 画面側 `useEffect` | `navigate('/orders', { state: { message, type: 'error' } })`。`DefaultLayout` がトースト表示 |
| キャンセル失敗 | `useCancelOrder` 呼び出し側の `mutationConfig.onError` | `toast.error('キャンセルに失敗しました')`。ボタンは活性に戻る（react-query が自動で `isPending` を false にする） |
| 認証切れ（401） | `lib/api-client.ts` の interceptor | 既存パターン（`PrivateRoute` で `/login` 誘導）を踏襲。当面 interceptor で特別処理しない |
| 画像読み込み失敗 | `<img>` の `onError` | `NO_IMAGE_URL` にフォールバック |

### 画面側エラー監視の実装イメージ

```tsx
// OrderDetailPage.tsx
const { data, error, isLoading } = useOrder({ orderId });
const navigate = useNavigate();

useEffect(() => {
  if (error) {
    navigate('/orders', {
      state: {
        message: '注文情報の取得に失敗しました',
        type: 'error',
      },
    });
  }
}, [error, navigate]);

if (isLoading) return <Loader />;
if (!data) return null;
return <OrderDetailContent order={data.data} />;
```

```tsx
// OrderListPage.tsx
const { data, error, isLoading } = useOrders({ page });

useEffect(() => {
  if (error) {
    toast.error('注文履歴の取得に失敗しました');
  }
}, [error]);
```

---

## スコープ外

- 管理者向け注文管理（3-5 で対応）
- ステータス更新（管理者機能）
- 配送追跡番号・配送業者
- 注文の編集（住所変更等）
- 領収書発行
- ページネーション以外の絞り込み（期間・ステータス・キーワード）
