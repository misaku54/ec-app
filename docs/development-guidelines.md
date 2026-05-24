# Development Guidelines

## コミット規約

[Conventional Commits](https://www.conventionalcommits.org/) に準拠する。

### フォーマット

```
<type>: <概要（日本語）>

- 変更点の詳細（必要な場合）
```

### type一覧

| type | 用途 |
|---|---|
| `feat:` | 新機能追加 |
| `fix:` | バグ修正 |
| `docs:` | ドキュメントのみの変更 |
| `refactor:` | リファクタリング |
| `chore:` | ビルド・設定ファイルの変更 |
| `style:` | コードスタイルの修正 |
| `test:` | テストの追加・修正 |

### 例

```
feat: 注文作成APIを実装

- POST /api/customer/order/create を追加
- 在庫チェック・減算をトランザクションで処理
```

---

## コーディング規約

### 共通

| 項目 | ルール |
|---|---|
| 変数名・メソッド名・クラス名 | 英語 |
| コメント | 日本語 |
| 略語 | 一般的なもの（id, url, api等）以外は使わない |

### Java

- クラス名: `UpperCamelCase`（例: `OrderService`）
- メソッド名・変数名: `lowerCamelCase`（例: `createOrder`, `totalAmount`）
- 定数: `UPPER_SNAKE_CASE`（例: `MAX_RETRY_COUNT`）
- パッケージ名: `lowercase`（例: `com.example.app.service`）

### TypeScript / React

- コンポーネント名: `UpperCamelCase`（例: `CartPage`）
- 変数名・関数名: `lowerCamelCase`（例: `useCartStore`, `addItem`）
- 型・インターフェース名: `UpperCamelCase`（例: `CartItem`, `ApiResponse`）
- ファイル名: コンポーネントは `UpperCamelCase.tsx`、それ以外は `lowerCamelCase.ts`
