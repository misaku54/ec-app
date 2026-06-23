# カスタムバリデーションアノテーションの作り方

Bean Validation の仕組みを使って、独自のバリデーションルールをアノテーションとして定義できる。
ここでは `@StrongPassword` を例に解説する。

---

## 必要なファイル（2つセット）

| ファイル | 役割 |
|---------|------|
| `StrongPassword.java` | アノテーション定義 |
| `StrongPasswordValidator.java` | バリデーションロジック |

---

## ① アノテーション定義（StrongPassword.java）

```java
@Target({ElementType.FIELD})          // フィールドに付けられる
@Retention(RetentionPolicy.RUNTIME)   // 実行時に有効
@Constraint(validatedBy = StrongPasswordValidator.class)  // ロジッククラスを指定
public @interface StrongPassword {
    String message() default "パスワードは8文字以上で、英大文字・英小文字・数字をそれぞれ1文字以上含めてください";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

### ポイント解説

| 要素 | 説明 |
|------|------|
| `@Target` | このアノテーションをどこに付けられるかを指定。`FIELD` はフィールドのみ |
| `@Retention(RUNTIME)` | アノテーション情報を実行時まで保持する（これがないとバリデーションが動かない） |
| `@Constraint(validatedBy = ...)` | 実際のチェックロジックが入るクラスを指定 |
| `message()` | バリデーション失敗時のデフォルトメッセージ |
| `groups()`, `payload()` | Bean Validation の仕様で必須（基本は空のままでOK） |

---

## ② バリデーションロジック（StrongPasswordValidator.java）

```java
public class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null || password.isBlank()) {
            return true; // @NotBlank に任せる（nullチェックはここでやらない）
        }
        return password.length() >= 8
            && password.chars().anyMatch(Character::isUpperCase)  // 英大文字が1文字以上
            && password.chars().anyMatch(Character::isLowerCase)  // 英小文字が1文字以上
            && password.chars().anyMatch(Character::isDigit);     // 数字が1文字以上
    }
}
```

### ポイント解説

| 要素 | 説明 |
|------|------|
| `ConstraintValidator<StrongPassword, String>` | `<アノテーション, チェック対象の型>` を指定 |
| `isValid()` | `true` を返せばOK、`false` を返せばバリデーションエラー |
| null のとき `true` を返す | null チェックは `@NotBlank` に任せる（責務を分ける） |
| `password.chars()` | String を文字のストリームに変換 |
| `anyMatch(Character::isUpperCase)` | 1文字でも大文字があれば true |

---

## ③ フォームクラスで使う

```java
@NotBlank(message = "{require}")
@StrongPassword
private String password;
```

`@Valid` が付いたリクエストを受け取ると、Spring が自動でバリデーションを実行する。

---

## 処理の流れ

```
リクエスト
  ↓
Controller の @Valid
  ↓
Bean Validation が @StrongPassword を発見
  ↓
StrongPasswordValidator.isValid() を実行
  ↓
false → MethodArgumentNotValidException → GlobalExceptionHandler が 400 を返す
true  → 処理続行
```

---

## 使い分けのまとめ

| バリデーション | 方法 |
|-------------|------|
| 必須チェック | `@NotBlank` |
| 文字数チェック | `@Size(min=X, max=Y)` |
| メール形式チェック | `@Email` |
| **独自ルール（DB不要）** | **カスタムアノテーション ← ここ** |
| DB を使うチェック（重複等） | Service 層で実装 |
