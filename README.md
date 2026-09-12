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

### 1. インフラ起動

```bash
docker compose up -d
```

DB（PostgreSQL:5433）、LocalStack、MinIO、Frontendが起動します。

### 2. Backend

```bash
cd app && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

### 3. Frontend（ローカルで動かす場合）

```bash
cd frontend && npm run dev   # port 5173
```

Docker で起動した場合は http://localhost:3003 、ローカルで起動した場合は http://localhost:5173 で開きます。
バックエンドは http://localhost:8888 で待ち受けます（CORS 許可は `localhost:3003` のみ）。

## 初期データ / デモアカウント

DB マイグレーション（Flyway）はバックエンド起動時に自動実行され、デモ用のアカウントと商品が投入されます。
クローン直後でも追加の手作業なしでログインから購入まで一通り試せます。

| 種別 | メールアドレス | パスワード | 権限 |
|---|---|---|---|
| 管理者 | `admin@example.com` | `password` | ADMIN（管理画面あり） |
| 会員 | `user@example.com` | `password` | USER |

- 商品はバッグ・革小物8件（うち1件は在庫切れ状態）。
- 商品画像は投入されません。MinIO のバケットが未作成のため、画像は管理画面からアップロードしてください。

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
