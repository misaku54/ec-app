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

frontend/src/
  components/
    pages/
      OrderListPage.tsx              🆕 注文履歴ページ
      OrderDetailPage.tsx            🆕 注文詳細ページ
    organisms/
      OrderList.tsx                  🆕 注文行のリスト
      OrderDetailContent.tsx         🆕 注文詳細の本体
    molecules/
      OrderListItem.tsx              🆕 注文1件の表示
    atoms/
      OrderStatusLabel.tsx           🆕 ステータスバッジ
  hooks/
    useOrders.ts                     🆕 一覧取得
    useOrder.ts                      🆕 詳細取得
    useCancelOrder.ts                🆕 キャンセル
  utils/
    orderStatus.ts                   🆕 status の日本語変換
  types/
    Order.ts                         🆕 Order / OrderListItem / OrderDetail / OrderItemDetail
  router/
    Router.tsx                       ✅ `/orders` `/orders/:id` 追加
  components/organisms/
    CustomerHeader.tsx               ✅ 「注文履歴」リンク追加
  components/pages/
    OrderCompletePage.tsx            ✅ 「注文履歴を見る」リンク追加
```

---

## 実装タスク

### BE

1. **DTO 作成**: `OrderListItemDto` / `OrderDetailDto` / `OrderItemDetailDto`
2. **Mapper 追加**: `selectOrderList(accountId)` / `selectOrderById(id, accountId)` / `selectOrderItemsByOrderId(orderId)` / `updateOrderStatus(id, status)`
3. **Service 追加**: `getOrderList(accountId, page)` / `getOrderDetail(id, accountId)` / `cancelOrder(id, accountId)`
   - キャンセル処理は `@Transactional`：status更新 + 在庫加算
4. **Controller 追加**: `OrderApi` に 3エンドポイント追加
5. **404 ハンドリング**: 他人の注文取得・キャンセル時は `OrderNotFoundException` などをスロー → GlobalExceptionHandler で 404

### FE

1. **型定義**: `types/Order.ts`
2. **ユーティリティ**: `utils/orderStatus.ts`
3. **フック**: `useOrders` / `useOrder` / `useCancelOrder`
4. **アトム/モルキュール**: `OrderStatusLabel` / `OrderListItem`
5. **ページ**: `OrderListPage` / `OrderDetailPage`
6. **Router**: `/orders` `/orders/:id` を顧客側 Layout 配下に追加
7. **導線**:
   - `CustomerHeader` に「注文履歴」リンク追加
   - `OrderCompletePage` に「注文履歴を見る」リンク追加

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
