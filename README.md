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

## 必要なもの

- Docker / Docker Compose（これだけで全サービスが動きます）
- ホストで個別に起動する場合のみ JDK 21 と Node.js 20 以上

## 起動方法

```bash
docker compose up -d
```

DB・バックエンド・フロントエンド・MinIO・LocalStack がすべて起動します。
初回はバックエンドイメージのビルドと依存ライブラリの取得に数分かかります。
起動の進み具合は `docker compose logs -f app` で確認できます。

| URL | 内容 |
|---|---|
| http://localhost:3003 | フロントエンド |
| http://localhost:8888 | バックエンド API |
| http://localhost:9001 | MinIO コンソール（`minioadmin` / `minioadmin`） |
| localhost:5433 | PostgreSQL（`ecuser` / `ecpass` / DB名 `ecdb`） |

商品画像用の MinIO バケットは `createbuckets` コンテナが起動時に作成し、匿名 GET を許可します。

停止は `docker compose down`。DB と MinIO のデータも消して作り直す場合は `docker compose down -v` です。

---

## 開発時の起動（任意）

動かすだけなら上の `docker compose up -d` で完結します。
以下は開発中にデバッガやホットリロードを使いたい場合の代替手段です。

### バックエンドだけホストで起動する

IntelliJ や Maven から起動するときは `local` プロファイルを指定します。
接続先が `localhost` になるため、インフラはコンテナで動かしたままにします。
ポート 8888 がぶつかるので、バックエンドのコンテナは止めておきます。

```bash
docker compose up -d postgresdb minio createbuckets frontend
docker compose stop app
cd app && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

### フロントエンドだけホストで起動する

CORS は `http://localhost:3003` のみ許可しているため、Vite も 3003 番で起動します。
ポートがぶつかるので、フロントエンドのコンテナは止めておきます。

```bash
docker compose stop frontend
cd frontend && npm install && npm run dev -- --port 3003
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
