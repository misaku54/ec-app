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

### DB接続（psql）

```bash
docker exec $(docker ps --filter "name=postgresdb" -q) psql -U ecuser -d ecdb -c "<SQL>"
```

接続情報の詳細は [`docs/db-schema.md`](docs/db-schema.md) の「接続」セクションを参照。

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
- フロントエンドの実装を提案する前に、対応するバックエンドの既存コードを確認する。バックエンドの実装を提案する前に、対応するフロントエンドの既存コードを確認する。
- `docs/knowledge/` 配下はユーザー専用の学習ノートのため、質問への回答や実装提案の根拠として参照しない（grep / read しない）。ユーザーから「ナレッジを追加して」と依頼されたときのみ書き込む。

## 開発ガイドライン

コミット規約・コーディング規約の詳細は [`docs/development-guidelines.md`](docs/development-guidelines.md) を参照。

### フロントエンド参照リポジトリ

Reactのコード指摘・サンプルコード提示・コード作成を行う際は、以下のリポジトリを参照した上で対応すること。

- **パス:** `~/referenceRepo/bulletproof-react/`
- **内容:** React アーキテクチャのベストプラクティス集
  - プロジェクト構造（`docs/project-structure.md`）: featuresベースのディレクトリ構成、単方向依存ルール
  - コンポーネント設計（`docs/components-and-styling.md`）: コロケーション、分割基準、抽象化指針
  - APIレイヤー（`docs/api-layer.md`）: APIクライアントの一元管理、リクエスト定義の分離
  - 状態管理（`docs/state-management.md`）: Component / Application / Server Cache / Form / URL の5分類
- **実装例:** `apps/react-vite/src/` 配下に具体的なコードサンプルあり

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

### `docs/knowledge/`（ユーザー専用の学習ノート）

ユーザーが学習・気づきを蓄積する個人用のメモ置き場。`YYYY-MM-DD/{topic}.md` の形式で保存する。

```
docs/knowledge/
  2026-06-05/
    pagination-with-join.md
```

**重要:**

- 陳腐化しても削除・移動しない。すべて蓄積し続ける
- **Claudeはこのフォルダを質問回答・実装の根拠として参照しない。**ユーザーから明示的に「ナレッジに追加して」「ナレッジを更新して」と依頼されたときのみ書き込む
- ファイル冒頭には最小限のメタ情報（書いた日・関連コード）を記載する

## Local Development

バックエンドをIntelliJで起動する場合、`local` プロファイルを指定する（`application-local.yml` が読み込まれMinIOエンドポイントが設定される）。フロントエンドはDockerまたはローカルで起動（port 3003 または 5173）。CORSは `localhost:3003` のみ許可設定。
