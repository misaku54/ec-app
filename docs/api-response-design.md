# APIレスポンス設計 改善案

## 現状の問題点

| 問題 | 具体例 |
|------|--------|
| `ResponseDto` と `ResponseListDto` で構造が不統一 | `ResponseListDto` には `status` フィールドがない |
| `status` の型が不統一 | `ResponseDto` は String ("OK")、`ErrorDto` は Integer (400) |
| `updateProduct` が `ResponseDto<String>` で `data: "success"` を返している | 意味のないデータを返している |
| `createProduct` が `response.setStatus("OK")` なのに `ResponseEntity.status(CREATED)` を返している | HTTPステータスとボディの status が矛盾 |

---

## 改善案

### 案A: status を String で統一（"success" / "error"）

```json
// 成功（単体）
{
  "status": "success",
  "data": { "id": 1, "name": "商品A" }
}

// 成功（一覧）
{
  "status": "success",
  "data": [...],
  "pageInfo": { "totalCount": 100, "totalPage": 5, "currentPage": 1, "size": 20 }
}

// 失敗
{
  "status": "error",
  "error": { "code": 400, "message": "バリデーションエラー" }
}
```

**メリット:** フロントで `if (res.status === "success")` と直感的に判定できる  
**デメリット:** HTTPステータスコードと二重管理になる

---

### 案B: status を Integer（HTTPステータスコード）で統一

```json
// 成功（単体）
{
  "status": 200,
  "data": { "id": 1, "name": "商品A" }
}

// 失敗
{
  "status": 400,
  "error": { "message": "バリデーションエラー" }
}
```

**メリット:** HTTPステータスコードと一致するため意味が明確  
**デメリット:** フロントで `if (res.status === 200)` より `if (res.status >= 200 && res.status < 300)` の判定が複雑

---

### 案C: ボディに status を持たず ResponseEntity の HTTP ステータスに任せる（Spring Boot標準）

```json
// 成功（単体） HTTP 200
{ "data": { "id": 1, "name": "商品A" } }

// 失敗 HTTP 400
{ "error": { "message": "バリデーションエラー" } }
```

エラーは `@ControllerAdvice` + `@ExceptionHandler` で一元管理。

**メリット:** ボディがシンプル、Spring の標準的なパターン  
**デメリット:** フロントは HTTP ステータスコードでハンドリングが必要（axios interceptor が必要）

---

## 推奨案: 案A（String status）+ 案Cのエラーハンドリングを組み合わせ

```java
// 成功レスポンス（統一）
public class ApiResponse<T> {
    private String status;  // "success"
    private T data;
    private PageInfoDto pageInfo;  // 一覧のときのみ
}

// エラーレスポンス（統一）
public class ApiErrorResponse {
    private String status;  // "error"
    private ErrorDetail error;

    public static class ErrorDetail {
        private int code;
        private String message;
    }
}
```

エラーは `@ControllerAdvice` で一元管理：
```java
@ExceptionHandler(Exception.class)
public ResponseEntity<ApiErrorResponse> handleException(Exception e) {
    // 統一エラーレスポンスを返す
}
```

### フロント側の統一イメージ
```ts
type ApiResponse<T> = {
  status: "success" | "error";
  data?: T;
  pageInfo?: PageInfo;
  error?: { code: number; message: string };
};
```

---

## 修正が必要なファイル

| ファイル | 修正内容 |
|---------|---------|
| `ResponseDto.java` | `ApiResponse<T>` に名称変更・pageInfo フィールド追加 |
| `ResponseListDto.java` | `ApiResponse<T>` に統合 |
| `ErrorDto.java` / `ApiErrorDto.java` | `ApiErrorResponse` に統合 |
| `AdmProductApi.java` | 全エンドポイントを新レスポンス形式に修正 |
| `AccountApi.java` | 同上 |
| `@ControllerAdvice` クラス | 新規作成（エラーハンドリング一元化） |
| フロント `*.ts` 型定義 | `ApiResponse<T>` 型に統一 |

---

## 実装済みの状態（現在のコード）

### `ResponseDto<T>`
```java
// status: String, data: T
// → 単体レスポンス用（createProduct, updateProduct, deleteProduct, getProduct等）
```

### `ResponseListDto<T>`
```java
// status: String, data: List<T>, pageInfo: PageInfoDto
// → 一覧レスポンス用（getAllProducts等）
// ✅ 設計案通り status + pageInfo を持っている
```

### `ErrorResponseDto`
```java
// status: "error"（固定）
// error.code: int
// error.message: String
// error.fieldError: Map<String, List<String>>（バリデーションエラー用）
// ✅ 設計案より進んでいる：fieldError を持っている
```

---

## 実際のレスポンス形式（確定）

```json
// 成功（単体）
{
  "status": "success",
  "data": { "id": 1, "name": "商品A" }
}

// 成功（一覧）
{
  "status": "success",
  "data": [...],
  "pageInfo": { "totalCount": 100, "totalPage": 5, "currentPage": 1, "size": 20 }
}

// エラー（一般）
{
  "status": "error",
  "error": { "code": 400, "message": "Bad Request" }
}

// エラー（バリデーション）
{
  "status": "error",
  "error": {
    "code": 400,
    "message": "バリデーションエラー",
    "fieldError": {
      "name": ["商品名は必須です"],
      "price": ["価格は0以上で入力してください"]
    }
  }
}
```
