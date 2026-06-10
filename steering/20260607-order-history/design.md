# 注文履歴（会員向け）詳細設計書

## 概要

ログイン済みの会員（USER/ADMIN）が自分の注文履歴を閲覧し、状況に応じて注文をキャンセルできる機能。

---

## 設計方針

1. **権限境界**
   - `/api/customer/order/*` の各エンドポイントは認証済みユーザーのみ
   - 注文詳細・キャンセルは `account_id` がログインユーザーと一致する場合のみ操作可能。他人の注文へのアクセスは 404
2. **状態の単一の源は DB**
   - 一覧・詳細の都度 GET で取得する。フロント側でキャッシュは持たない（カートとは別概念）
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
- キャンセル成功時: トースト + ステータスを `CANCELLED` に更新（画面はAPI再取得で反映）
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

```
app/src/main/java/com/example/app/
  rest/
    OrderApi.java                    ✅ 既存に list / detail / cancel エンドポイント追加
  service/
    OrderService.java                ✅ getOrderList / getOrderDetail / cancelOrder を追加
    impl/OrderServiceImpl.java       ✅ 同上
  mapper/
    OrderMapper.java                 ✅ selectOrderList / selectOrderById / selectOrderItemsByOrderId / updateOrderStatus 等を追加
  dto/
    OrderListItemDto.java            🆕 一覧用 DTO
    OrderDetailDto.java              🆕 詳細用 DTO（OrderItem 込み）
    OrderItemDetailDto.java          🆕 詳細の orderItem 用 DTO（currentImageS3Key 込み）
app/src/main/resources/mapper/
  OrderMapper.xml                    ✅ 既存に select 追加

### FE（bulletproof-react 流の features 構成）

本機能から `src/features/<feature>/` ベースのディレクトリ構成と **react-query** を導入する。
既存コード（products / cart / auth 等）は据え置きで、新規 API のみ react-query を使う**ハイブリッド運用**。

```
frontend/src/
  lib/
    api-client.ts                    🆕 共通 axios クライアント（既存 useAxios の interceptor を移植）
    react-query.ts                   🆕 QueryClient のデフォルト config + QueryConfig/MutationConfig 型ユーティリティ
  app/
    provider.tsx                     🆕 QueryClientProvider + 既存の Provider を集約（既存 main.tsx から移管）
  features/
    orders/
      api/
        get-orders.ts                🆕 fetcher + getOrdersQueryOptions + useOrders（useQuery）
        get-order.ts                 🆕 fetcher + getOrderQueryOptions + useOrder（useQuery）
        cancel-order.ts              🆕 fetcher + useCancelOrder（useMutation + invalidate）
      components/
        OrderList.tsx                🆕 一覧テーブル（useOrders を呼ぶ）
        OrderDetailContent.tsx       🆕 詳細表示（useOrder を呼ぶ）
        OrderStatusLabel.tsx         🆕 ステータスバッジ（formatOrderStatus を使用）
        CancelOrderButton.tsx        🆕 キャンセルボタン（useCancelOrder。PENDING時のみ表示）
      types/
        order.ts                     🆕 Order / OrderHistoryItem / OrderDetail / OrderItemDetail / OrderStatus
      utils/
        format-status.ts             🆕 formatOrderStatus(status) — 日本語ラベル変換
  components/
    pages/
      OrderListPage.tsx              🆕 features/orders/components を組み立てる薄いラッパ
      OrderDetailPage.tsx            🆕 features/orders/components を組み立てる薄いラッパ
    organisms/
      CustomerHeader.tsx             ✅ 「注文履歴」リンク追加
    pages/
      OrderCompletePage.tsx         ✅ 「注文履歴を見る」リンク追加
  router/
    Router.tsx                       ✅ `/orders` `/orders/:id` 追加
```

**配置ルール:**

- `features/orders/` は orders 固有のコード。他の feature から import 禁止
- ページ（`components/pages/`）は features を組み立てる薄いラッパ。ロジックは features に閉じる
- `lib/` は app 全体で使う基盤コード（axios インスタンス、react-query 設定）

---

## 実装タスク

### BE（再掲・順番）

1. **DTO 作成**: `OrderHistoryItemDto`（一覧用） / `OrderDetailDto`（詳細用、orderItems込み） / `OrderItemDetailDto`
2. **Mapper 追加**: `selectOrderList(accountId)` / `selectOrderById(id, accountId)` / `updateOrderStatus(id, status)` / 在庫加算用
3. **Service 追加**: `getOrderList(accountId)` / `getOrderDetail(id, accountId)` / `cancelOrder(id, accountId)`
   - キャンセル処理は `@Transactional`：status更新 + 在庫加算
4. **Controller 追加**: `OrderApi` に 3エンドポイント追加
5. **404 ハンドリング**: null 戻り → `ApiNotFoundException` → GlobalExceptionHandler で 404

### FE（手順 — bulletproof-react 流）

#### 事前準備（共通基盤）

1. **依存追加**: `npm i @tanstack/react-query @tanstack/react-query-devtools`
2. **`lib/api-client.ts` 作成**:
   - `axios.create({ baseURL, withCredentials: true })`
   - request interceptor: 認証ヘッダ等（既存 `useAxios` から移植）
   - response interceptor: `response.data` を return（fetcher 関数の return 型がスッキリする）。エラー時は `Promise.reject(error)`
3. **`lib/react-query.ts` 作成**:
   - `queryConfig`: `staleTime: 60 * 1000`, `refetchOnWindowFocus: false`, `retry: false`
   - `QueryConfig<T>` / `MutationConfig<T>` の型ユーティリティ（bulletproof-react から流用）
4. **QueryClientProvider 設置**: `App.tsx` か `app/provider.tsx` のルートで `<QueryClientProvider client={queryClient}>` で全体を包む
5. **DevTools の組み込み**（任意・開発時のみ）: `<ReactQueryDevtools />`

#### orders feature の実装

6. **`features/orders/types/order.ts`**:
   ```ts
   export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
   export type OrderHistoryItem = { id: number; status: OrderStatus; totalAmount: number; createdAt: string };
   export type OrderItemDetail = { productId: number; productName: string; unitPrice: number; quantity: number; currentImageS3Key: string | null };
   export type OrderDetail = { id: number; status: OrderStatus; totalAmount: number; shippingName: string; shippingPostalCode: string; shippingAddress: string; shippingPhone: string | null; note: string | null; createdAt: string; orderItems: OrderItemDetail[] };
   ```
7. **`features/orders/utils/format-status.ts`**: `formatOrderStatus(status: OrderStatus): string` を export
8. **`features/orders/api/get-orders.ts`**（パターン: fetcher + queryOptions + フック）:
   ```ts
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
9. **`features/orders/api/get-order.ts`**: 同様のパターンで詳細取得
10. **`features/orders/api/cancel-order.ts`**（mutation パターン）:
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
11. **`features/orders/components/`**: `OrderStatusLabel` → `OrderList` → `OrderDetailContent` → `CancelOrderButton` の順に。各コンポーネントは feature内のフック（`useOrders` 等）を直接呼ぶ
12. **ページ**: `components/pages/OrderListPage.tsx` は `<OrderList />` を return するだけの薄いラッパ。`OrderDetailPage.tsx` も同様
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

- **feature 固有の型**: `features/orders/types/order.ts`
- **app 横断の型**（PageInfo, ApiResponse など）: 既存の `src/types/` のまま
- bulletproof-react に倣うなら共通型は `src/types/api.ts` に集約してもよいが、今回はスコープ外

---

## エラーハンドリング

| エラー | 挙動 |
|---|---|
| 一覧取得失敗 | トースト通知（ページに留まる） |
| 詳細取得失敗（404・5xx 等） | `/orders` へ navigate + state でエラーメッセージ |
| キャンセル失敗 | トースト通知（ページに留まる、ボタンは押せる状態に戻す） |
| 画像読み込み失敗 | `onError` で `NO_IMAGE_URL` |

---

## スコープ外

- 管理者向け注文管理（3-5 で対応）
- ステータス更新（管理者機能）
- 配送追跡番号・配送業者
- 注文の編集（住所変更等）
- 領収書発行
- ページネーション以外の絞り込み（期間・ステータス・キーワード）
