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
