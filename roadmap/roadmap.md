# ECサイト 実装計画書

<!-- CURRENT-STATUS:START -->
## 📍 現在地

> このブロックは SessionStart フックで毎セッション自動表示される。タスクの着手・完了時にここを最優先で更新すること。

- **進行中フェーズ**: Phase 3-4 注文履歴（会員向け）
- **いま着手中のタスク**: FE の API レイヤ実装（`api/orders/` の3点セット）。`get-orders.ts` / `get-order.ts` 完了、`cancel-order.ts` 未着手
- **直近に完了したこと**: BE 一覧/詳細 API、react-query 基盤（`lib/api-client.ts` / `lib/react-query.ts` / `QueryClientProvider`）
- **次にやること**: `cancel-order.ts`（mutation）→ コンポーネント（OrderStatusLabel → OrderList → OrderDetailContent → CancelOrderButton）→ ページ → Router → 導線
- **設計書**: `steering/20260607-order-history/design.md`

<!-- CURRENT-STATUS:END -->

## 前提・現状整理

### 技術スタック

- **Backend**: Spring Boot 3.5 / Java 21 / MyBatis / PostgreSQL / Flyway
- **Frontend**: React 19 / TypeScript / Vite / Tailwind CSS / React Hook Form
- **Infrastructure**: Docker Compose / MinIO(S3互換) / PostgreSQL 16
- **デプロイ先**: AWS EC2 / ECS（コンテナ）

### 実装済み機能

- ✅ 管理者ログイン（セッション認証・JSON Login）
- ✅ `GET /api/me` による認証状態管理（AuthContext）
- ✅ 商品一覧（管理者向け API + 画面）
- ✅ 商品詳細表示（管理者向け API + 画面）
- ✅ 商品作成（API + 画面 + 画像アップロード）
- ✅ 商品削除（ソフトデリート）
- ✅ 商品画像の S3(MinIO) アップロード
- ✅ 商品一覧検索・フィルタ API（`ProductSearchParam`）
- ✅ 公開商品一覧・詳細 API
- ✅ お客様向け商品一覧・詳細画面
- ✅ 会員登録（BE + FE）
- ✅ カート機能（Zustand、コンポーネント一式）
- ✅ ロールベース認可（ADMIN / USER）
- ✅ Flyway マイグレーション（V1〜V6）
- ✅ PrivateRoute による認証ガード
- ✅ ページネーション・トースト通知・確認ダイアログ

### 未実装・不完全な機能

- 🔶 商品編集 API（`POST /api/admin/product/update`）— BE実装あり・TODOコメント残
- 🔶 商品編集画面 — FE未実装
- ✅ 商品検索・フィルタ画面 — BE/FE 完了
- ✅ お客様向け商品詳細画面 — FE 完了（画像ギャラリー・カート追加・トースト含む）
- ✅ 管理画面と顧客画面のレイアウト分離 — `BaseLayout` + `AdmHeader` / `CustomerHeader` で分離完了
- ✅ 注文作成 API（`POST /api/customer/order/create`）— 完了
- ✅ チェックアウト画面・注文完了画面
- ❌ 注文履歴（会員向け）
- ❌ 管理者向け注文管理
- ⏳ バッチ処理（Spring Batch）— 余裕があれば
- ❌ 本番環境設定・CI/CD
- ❌ テスト（ほぼゼロ）

---

## 実装フェーズ一覧

全体を **5フェーズ** に分割し、フェーズごとに段階的に動くものを確認しながら進めます。

---

## フェーズ 1: 管理者機能の完成（目安: 2〜3週間）

管理者が商品のCRUD操作を画面から全て行えるようにする。

### 1-1. 商品作成画面・画像アップロード ✅ 完了

- ✅ **BE**: `POST /api/admin/product/create` の動作確認・修正
- ✅ **FE**: 商品作成フォーム（名前・説明・価格・在庫）
- ✅ **FE**: 画像アップロード機能（複数画像対応、プレビュー表示）
- ✅ **FE**: `useCreateProduct` フック作成
- ✅ **FE**: Router に `/admin/product/create` ルート追加

### 1-2. 商品編集画面 ← 後回し

- 🔶 **BE**: `POST /api/admin/product/update` — 実装あり・TODOコメント残（画像操作の完全対応が未完）
- ❌ **FE**: 商品編集フォーム（既存データプリフィル）
- ❌ **FE**: 画像の追加・削除UI
- ❌ **FE**: `useUpdateProduct` フック作成
- ❌ **FE**: Router に `/admin/product/edit/:id` ルート追加

### 1-3. 管理画面UX改善

- ✅ 商品一覧にページネーション追加（PageHelper 連携）
- ✅ トースト通知（作成・更新・削除の成功/失敗メッセージ）
- ✅ 確認ダイアログ（削除時）
- ✅ 商品一覧に検索・フィルタ機能追加（名前・価格帯・在庫あり）— BE/FE 完了。URL同期は `useProductSearchParams` で実装

---

## フェーズ 2: 会員登録・お客様向け基本画面（目安: 2〜3週間）

お客様が商品を閲覧し、会員登録・ログインできるようにする。

### 2-1. 会員登録機能 ✅ 完了

- ✅ **BE**: `POST /api/public/register` — 会員登録API（バリデーション・BCrypt・ロール付与）
- ✅ **FE**: 会員登録ページ（`/register`）
- ✅ **FE**: `useRegister` フック作成

### 2-2. お客様向け商品一覧画面 ✅ 完了

- ✅ **FE**: 公開商品一覧ページ
- ✅ **FE**: `useProducts` フック作成

### 2-3. お客様向け商品詳細画面 ✅ 完了

- ✅ **BE**: 公開商品詳細API（`GET /api/public/product/:id`）
- ✅ **FE**: 商品詳細ページ（`ProductDetailPage`）— ローディング・null・本体の3状態出し分け
- ✅ **FE**: `ProductDetailContent`（organisms）— `ProductDetail → CartItem` 変換 + 画像ギャラリー + AddToCartButton
- ✅ **FE**: `ProductImageGallery`（molecules）— サムネイル切替の内部 state を持つ
- ✅ **FE**: `useProduct` フック作成（エラー時は `/products` へ navigate + state でトースト）
- ✅ **FE**: `AddToCartButton` にトースト通知内蔵（カート追加成功メッセージ）
- ✅ **FE**: Router に `/products/:id` 追加

### 2-4. お客様向けレイアウト 🔶 課題あり

- ✅ **FE**: `DefaultLayout` テンプレート・`Header` コンポーネント作成
- ✅ **FE**: Router構造の管理者／お客様ルート分離（`PrivateRoute` + `AdminRoute` の2段構え）
- 🔶 **FE**: 管理画面と顧客画面で同じ `Header` を共用しており動線に不整合あり（カートアイコンが管理画面でも表示・顧客画面でも「Admin」表記等）→ **2-5 で対応**

### 2-5. 管理画面・顧客画面のレイアウト分離 ❌ 未着手

設計書: `steering/20260607-layout-refactor/design.md`

- ❌ **FE**: `templates/BaseLayout.tsx` 新規作成（共通ロジック：トースト処理・`<main>`・`<Footer>`）
- ❌ **FE**: `templates/AdmDefaultLayout.tsx` 新規作成（管理者用ラッパ）
- ❌ **FE**: `templates/CustomerDefaultLayout.tsx` 新規作成（顧客用ラッパ）
- ❌ **FE**: `organisms/AdmHeader.tsx` 新規作成（カート非表示・「商品管理」リンク）
- ❌ **FE**: `organisms/CustomerHeader.tsx` 新規作成（カートアイコン・「商品一覧」リンク）
- ❌ **FE**: `router/Router.tsx` の Layout 差し替え
- ❌ **FE**: `pages/AdmProductDetail.tsx` のメンテ（`<Loader />` に統一・`useEffect` 依存配列に `id` を追加）
- ❌ **FE**: 旧 `Header.tsx` / `DefaultLayout.tsx` 削除

---

## フェーズ 3: カート・注文機能（目安: 3〜4週間）

ECサイトのコア — カートと注文のフルフローを実装。

### 3-1. DB設計（Flyway マイグレーション）✅ 完了

- ✅ `V6__add_order_tables.sql` — orders / order_items テーブル作成済み

### 3-2. カート機能（フロントエンド管理）✅ 完了

- ✅ **FE**: `useCartStore`（Zustand）— カート状態管理・localStorage永続化
- ✅ **FE**: カートページ・`CartList`・`CartItemRow` コンポーネント作成
- ✅ **FE**: カートページCSS（CartList・CartItemRow スタイル適用）
- ✅ **FE**: ヘッダーにカートアイコン + 商品数バッジ

### 3-3. 注文フロー ✅ 完了

- ✅ **BE**: `POST /api/customer/order/create` — 完了（在庫チェック・減算・INSERT）
- ✅ **FE**: チェックアウト画面（`/checkout`）
- ✅ **FE**: 注文完了画面（`/order/complete/:orderId`）

### 3-4. 注文履歴（会員向け）← **次のタスク**

設計書: `steering/20260607-order-history/design.md`

- ❌ **BE**: `GET /api/customer/order/list` — 注文一覧API（ログインユーザーの注文を新着順、ページネーション）
- ❌ **BE**: `GET /api/customer/order/:id` — 注文詳細API（自分の注文のみ閲覧可。他人の注文は404）
- ❌ **FE**: `useOrders` / `useOrder` フック作成
- ❌ **FE**: 注文履歴ページ（`/orders`）— 注文番号・注文日・合計金額・ステータスの一覧
- ❌ **FE**: 注文詳細ページ（`/orders/:id`）— 注文した商品リスト・小計・合計
- ❌ **FE**: Router に `/orders` `/orders/:id` 追加
- ❌ **FE**: `CustomerHeader` に「注文履歴」リンク追加
- ❌ 注文完了画面から注文履歴・注文詳細への導線追加

**設計上の論点（着手前に確認）:**
- パスは `/mypage/orders` か `/orders` か → シンプルに `/orders` を推奨（マイページが他にないため）
- 注文ステータスの enum（PENDING / CONFIRMED / SHIPPED / DELIVERED / CANCELLED）の日本語表示はどこで持つか
- 注文詳細の画面で商品名・画像はスナップショット（注文時点）を出すか、現在のマスタを出すか
  - `order_items` にスナップショットを持っているか BE 側の確認が必要

### 3-5. 管理者向け注文管理

- **BE**: `GET /api/admin/order/list` — 注文一覧（管理者）
- **BE**: `POST /api/admin/order/status` — 注文ステータス更新
  - PENDING → CONFIRMED → SHIPPED → DELIVERED / CANCELLED
- **FE**: 注文管理ページ（`/admin/order/list`）
- **FE**: 注文詳細ページ（`/admin/order/:id`）

### 3-6. バッチ処理（Spring Batch）⏳ 余裕があれば

リクエスト/レスポンスでは扱えない定期処理を Spring Batch で実装する。サンプルコードとして
Spring Batch の `Job` / `Step` / `ItemReader` / `ItemProcessor` / `ItemWriter` の構造を見せる目的も兼ねる。

優先度順:

- ❌ **古い PENDING 注文の自動キャンセル** — 7日以上 PENDING のままの注文を `CANCELLED` に更新 + 在庫戻し
  - 3-4 のキャンセル処理とロジック共有できるので筋がいい
  - 起動: 日次（深夜帯）
- ❌ **日次売上集計** — 日次で `orders` を集計して `daily_sales` テーブルに INSERT
  - Reader/Processor/Writer の3点セットが綺麗に出るためサンプル向き
  - 新規テーブル `daily_sales`（V7 マイグレーション）が必要
- ❌ **在庫アラート（軽量版）** — 在庫閾値を下回った商品を抽出してログ出力
  - メール送信は別タスク化（外部依存が増えるため）

**スケジューラ:**
- Spring の `@Scheduled` で起動 or 起動コマンド + cron（Docker環境次第）
- 本タスクのスコープ内では `@Scheduled` で十分

---

## フェーズ 4: テスト・品質向上（目安: 1〜2週間）

デプロイ前にコード品質を確保する。

### 4-1. バックエンドテスト

- **Service 層のユニットテスト** — Mockito 使用
  - ProductServiceImpl のテスト
  - AccountServiceImpl のテスト
  - 注文作成ロジックのテスト（在庫チェック等）
- **Controller 層の統合テスト** — MockMvc 使用
  - 各 API のリクエスト/レスポンス確認
  - 認可テスト（ADMIN/USER/未認証のアクセス制御）
- **Mapper テスト** — MyBatis テスト
  - 主要な SQL クエリの動作確認

### 4-2. フロントエンドテスト

- **Vitest 導入** + React Testing Library
- ページコンポーネントのテスト
  - ログイン画面
  - 商品一覧表示
  - カート操作
- フック（hooks）のテスト
  - useLogin, useAllProducts, カート操作

### 4-3. その他品質改善

- Error Boundary コンポーネント追加
- API エラーハンドリング統一
- Loading スケルトン表示
- `useAxios` の interceptor 重複登録問題の修正

---

## フェーズ 5: 本番環境・デプロイ（目安: 1〜2週間）

AWS EC2/ECS へのデプロイとCI/CDの構築。

### 5-1. 本番用 Docker 構成

- **Backend Dockerfile 最適化**
  - マルチステージビルド（ビルド → 実行用イメージ）
  - JAR ファイルによる起動（`mvnw spring-boot:run` → `java -jar`）
- **Frontend ビルド最適化**
  - `npm run build` で静的ファイル生成
  - Nginx コンテナで配信 or S3 + CloudFront
- **docker-compose.prod.yml** 作成
  - 本番用環境変数
  - ヘルスチェック設定
  - ボリュームマウント整理

### 5-2. 環境変数・設定分離

- **BE**: `application-prod.properties` 作成
  - 本番DB接続情報（環境変数参照）
  - 本番S3設定（MinIO → AWS S3）
  - CORS 設定（本番ドメイン）
  - セッション設定（SameSite, Secure, HttpOnly）
- **FE**: `.env.production` 作成
  - API ベースURL
  - `ApiClient.ts` を環境変数参照に修正

### 5-3. AWS インフラ構築

- **ECS (Fargate)** or **EC2 + Docker Compose**
  - ECR にイメージプッシュ
  - タスク定義（Backend + Frontend + DB）
  - ALB（ロードバランサー）設定
- **RDS (PostgreSQL)** — マネージドDB
- **S3** — 商品画像ストレージ（MinIO → 本番S3）
- **セキュリティグループ** — ポート制限

### 5-4. CI/CD パイプライン（GitHub Actions）

```yaml
# .github/workflows/deploy.yml
# 1. テスト実行（BE: mvn test / FE: vitest）
# 2. Docker イメージビルド
# 3. ECR にプッシュ
# 4. ECS サービス更新（ローリングデプロイ）
```

---

## 全体スケジュール概要

| フェーズ    | 内容                     | 目安期間         |
| ----------- | ------------------------ | ---------------- |
| **Phase 1** | 管理者機能の完成         | 2〜3週間         |
| **Phase 2** | 会員登録・お客様向け画面 | 2〜3週間         |
| **Phase 3** | カート・注文機能         | 3〜4週間         |
| **Phase 4** | テスト・品質向上         | 1〜2週間         |
| **Phase 5** | 本番環境・デプロイ       | 1〜2週間         |
| **合計**    |                          | **約 9〜14週間** |

> ※ 2〜3ヶ月の工数に合わせ、各フェーズの範囲を調整できます。
> ※ テストはフェーズ4にまとめていますが、各フェーズで簡単なテストを書きながら進めるのが理想です。

---

## 技術的な注意事項・推奨事項

### すぐに対応すべき点

1. **`ApiClient.ts` のベースURL** — 環境変数化する（`import.meta.env.VITE_API_URL`）
2. **`useAxios` の interceptor 重複登録** — ref で管理、または ApiClient に統一
3. **商品更新API（`updateProduct`）** — バックエンドTODOの対応

### レベルに合わせた進め方の提案

- **各機能は「API → 画面」の順で実装** — まず Postman/curl で API を確認してから画面を作る
- **既存コードのパターンを踏襲** — 新しい hooks は `useAllProducts` 等を参考にする
- **1機能ずつ PR を作る** — レビューしやすく、問題の切り分けがしやすい
- **わからない部分はまず動くコードを書き、後でリファクタ** — 完璧を目指さず、まず動かす
