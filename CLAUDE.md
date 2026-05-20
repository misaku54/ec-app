# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ECサイトアプリ。Spring Boot バックエンド + React フロントエンドの構成。

## Commands

### Backend (app/)

```bash
# ローカル起動（IntelliJ または Maven）
cd app && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# テスト実行
cd app && ./mvnw test

# 単一テストクラスの実行
cd app && ./mvnw test -Dtest=ClassName
```

### Frontend (frontend/)

```bash
cd frontend && npm run dev    # 開発サーバー起動 (port 5173)
cd frontend && npm run build  # ビルド
cd frontend && npm run lint   # ESLint
```

### インフラ（Docker Compose）

```bash
docker compose up -d          # DB (PostgreSQL:5433), LocalStack, MinIO, Frontend 起動
docker compose down
```

## Architecture

### Backend

- **Spring Boot 3.5 / Java 21**
- **MyBatis** でDBアクセス（Mapper XML: `app/src/main/resources/mapper/`）
- **Spring Data JPA + Flyway** でDBマイグレーション（`app/src/main/resources/db/migration/`）
- **PageHelper** でページネーション
- **AWS SDK v2 (S3)** + ローカル環境では **MinIO**（`application-local.yml` でエンドポイント上書き）
- **Spring Security** でセッションベース認証。カスタムフィルター `JsonEmailPasswordAuthenticationFilter` がJSON形式のログインを処理

**APIルーティング:**
- `POST /login` — 認証不要
- `/api/public/**` — 認証不要
- `/api/customer/**` — USER または ADMIN ロール必要
- `/api/admin/**` — ADMIN ロールのみ

**バリデーション処理の仕組み:**
- コントローラメソッドに `@UseBindingResult` アノテーションを付与すると、`ApiValidationAspect` が `BindingResult` を検査してバリデーションエラーを一括スロー
- `GlobalExceptionHandler` でエラーレスポンスを統一形式 (`ErrorResponseDto`) に変換

**レイヤー構成:**
```
rest/ (Controller) → service/ → mapper/ (MyBatis) → DB
                              → util/S3Util → MinIO/S3
```

### Frontend

- **React 19 + TypeScript + Vite**
- **TailwindCSS v4**
- **react-router v7** でルーティング（`frontend/src/router/Router.tsx`）
- **Zustand** でカート状態管理（`frontend/src/stores/useCartStore.ts`）
- **Context API** で認証状態管理（`frontend/src/context/AuthContext.ts`）
- **axios** でAPIアクセス（`frontend/src/api/ApiClient.ts`、baseURL: `http://localhost:8888/`、`withCredentials: true`）
- **react-hook-form** でフォーム管理
- **react-hot-toast** でトースト通知

**コンポーネント構成（Atomic Design）:**
```
atoms/ → molecules/ → organisms/ → templates/ → pages/
```

**認証フロー:**
- `PrivateRoute` がセッション状態を確認し、未認証の場合はログインページへリダイレクト
- 認証情報は `AuthProvider` で管理し `useAuth()` フックで取得

## DB Schema

テーブル定義・リレーションの詳細は [`docs/db-schema.md`](docs/db-schema.md) を参照。

## Claudeへの行動指針

- コミットはユーザーから明示的に依頼された場合のみ行う。修正・実装後に自動でコミットしない。
- 新規テーブルの作成・既存テーブルの変更を伴う実装を行った場合、`docs/db-schema.md` のメンテナンスが必要か確認する。

## 開発ガイドライン

コミット規約・コーディング規約の詳細は [`docs/development-guidelines.md`](docs/development-guidelines.md) を参照。

## ドキュメント構成

### `docs/`（永続ドキュメント）

プロジェクト全体を通じて常に最新を維持するドキュメントを置く。DBスキーマ・ER図・インフラ構成など、特定のタスクに紐づかない情報。

```
docs/
  db-schema.md    # テーブル定義・ER図・接続情報
```

### `steering/`（タスク別設計書）

タスクごとの設計書を `YYYYMMDD-タイトル/design.md` の形式で保存する。実装の意思決定・API仕様・シーケンス図など、そのタスクに紐づく情報。

```
steering/
  20260520-order-create/
    design.md
```

## Local Development

バックエンドをIntelliJで起動する場合、`local` プロファイルを指定する（`application-local.yml` が読み込まれMinIOエンドポイントが設定される）。フロントエンドはDockerまたはローカルで起動（port 3003 または 5173）。CORSは `localhost:3003` のみ許可設定。
