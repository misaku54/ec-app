# EC App

Spring Boot + React によるECサイトアプリ。

## 技術スタック

| レイヤー | 技術 |
|---|---|
| Backend | Spring Boot 3.5 / Java 21 / MyBatis / Flyway |
| Frontend | React 19 / TypeScript / Vite / TailwindCSS v4 |
| DB | PostgreSQL |
| 認証 | Spring Security（セッションベース） |
| ストレージ | S3 / MinIO（ローカル） |
| インフラ | Docker Compose |

## 起動方法

```bash
docker compose up -d
```

これだけで DB・バックエンド・フロントエンド・MinIO・LocalStack がすべて起動します。
初回はバックエンドイメージのビルドと依存ライブラリの取得に数分かかります。

| URL | 内容 |
|---|---|
| http://localhost:3003 | フロントエンド |
| http://localhost:8888 | バックエンド API（CORS 許可は `localhost:3003` のみ） |
| http://localhost:9001 | MinIO コンソール（`minioadmin` / `minioadmin`） |
| localhost:5433 | PostgreSQL |

商品画像用の MinIO バケットは `createbuckets` コンテナが起動時に作成し、匿名 GET を許可します。

### バックエンドをホストで起動する場合

IntelliJ や Maven から起動するときは `local` プロファイルを指定します。
接続先が `localhost` になるため、`docker compose up -d postgresdb minio createbuckets` でインフラだけ起動しておきます。

```bash
cd app && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

### フロントエンドをホストで起動する場合

```bash
cd frontend && npm run dev   # http://localhost:5173
```

## 初期データ / デモアカウント

DB マイグレーション（Flyway）はバックエンド起動時に自動実行され、デモ用のアカウントと商品が投入されます。
クローン直後でも追加の手作業なしでログインから購入まで一通り試せます。

| 種別 | メールアドレス | パスワード | 権限 |
|---|---|---|---|
| 管理者 | `admin@example.com` | `password` | ADMIN（管理画面あり） |
| 会員 | `user@example.com` | `password` | USER |

- 商品はバッグ・革小物24件。1ページ20件表示なので、一覧のページネーションを2ページで確認できます。
- 2件は在庫0、1件は画像なし（NO_IMAGE 表示の確認用）にしてあります。
- 商品画像は `docker/minio/seed-images/` に置いてあり、`createbuckets` が MinIO へ配置します。
  画像は [Unsplash](https://unsplash.com/) の Unsplash License による無償利用可能なものです。

バックエンドをコンテナで動かしている場合、マイグレーションを追加したら `docker compose up -d --build app` で
イメージを作り直してください（ソースはビルド時にコピーされるため）。

## API ルーティング

| パス | 認証 |
|---|---|
| `POST /login` | 不要 |
| `/api/public/**` | 不要 |
| `/api/customer/**` | USER または ADMIN |
| `/api/admin/**` | ADMIN のみ |

## ドキュメント

- [`docs/db-schema.md`](docs/db-schema.md) — テーブル定義・ER図・DB接続情報
- [`docs/development-guidelines.md`](docs/development-guidelines.md) — コミット規約・コーディング規約
- `steering/` — タスク別設計書
