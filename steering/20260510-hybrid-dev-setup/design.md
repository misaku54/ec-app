# ハイブリッド開発環境 移行計画

## 目的・背景

IntelliJ の自動ビルド（auto-build）が Docker コンテナ内の Spring Boot DevTools と競合し、  
ホットリロードのたびに `Failed to configure a DataSource` エラーが発生する。

**根本原因：**  
IntelliJ が `target/classes` に断続的に書き込む → DevTools がクラスパス変化を検知して restart →  
その際 `application.properties` が `target/classes` に存在しない（`addResources` デフォルト false）→  
DataSource URL が見えずに起動失敗。

**解決方針：**  
`app` コンテナを廃止し、IntelliJ から直接 Spring Boot を起動する。  
PostgreSQL / MinIO / LocalStack / frontend は Docker のまま継続。

---

## 環境構成（移行後）

```
[IntelliJ]
  └── Spring Boot (port 8888) ← ローカル直接起動

[Docker Compose]
  ├── postgresdb  (localhost:5433 → コンテナ5432)
  ├── minio       (localhost:9000, 9001)
  ├── localstack  (localhost:4566)
  └── frontend    (localhost:3003)
```

フロントエンド（`ApiClient.ts`）は `localhost:8888` を向いているのでポートを合わせる。

---

## 現状確認（作業開始前チェック）

| ファイル | 状態 | 備考 |
|---------|------|------|
| `docker-compose.yml` の `app` サービス | ❌ 削除が必要 | IntelliJ で起動するので不要。`profiles: [docker]` は暫定対応だった |
| `.idea/runConfigurations/AppApplication__local_.xml` | ✅ 完了 | 環境変数・profile=local 設定済み |
| `application-local.properties` | ❌ 未作成 | DB URL を `localhost:5433` に向ける必要あり |
| `application-local.yml` | ❌ 未作成 | MinIO endpoint を `localhost:9000` に向ける必要あり |


---

## タスク一覧

### STEP 0: `docker-compose.yml` から `app` サービスを削除

**なぜ不要になるか：**  
IntelliJ から直接 Spring Boot を起動するため、`app` コンテナは完全に役割を終える。  
`profiles: [docker]` で起動を抑制していたが、そもそも定義ごと削除してスッキリさせる。

**削除する設定ブロック（`docker-compose.yml`）:**

```yaml
# ↓ このブロック全体を削除する
app:
  build: ./app
  profiles:
    - docker
  depends_on:
    - postgresdb
  env_file: ./.env
  ports:
    - "8888:8080"
  volumes:
    - ./app:/app
  command: ./mvnw spring-boot:run
  stdin_open: true
  tty: true
```

**削除後のサービス構成:**

```yaml
services:
  postgresdb: ...  # そのまま
  frontend:   ...  # そのまま
  localstack: ...  # そのまま
  minio:      ...  # そのまま
  # app は削除
```

---

### STEP 1: `application-local.properties` 作成

**ファイル:** `app/src/main/resources/application-local.properties`

```properties
# ローカル IntelliJ 起動用プロファイル
# PostgreSQL: Docker が 5433 でホスト公開しているのでそこに向ける
spring.datasource.url=jdbc:postgresql://localhost:5433/${POSTGRES_DB}

# フロントエンドが localhost:8888 を向いているのでポートを合わせる
server.port=8888
```

---

### STEP 2: `application-local.yml` 作成

**ファイル:** `app/src/main/resources/application-local.yml`

```yaml
# ローカル IntelliJ 起動用プロファイル
# MinIO: Docker が 9000 でホスト公開しているのでそこに向ける
aws:
  endpoint: http://localhost:9000
```

---

### STEP 3: IntelliJ 側の設定（手動作業）

1. `app/pom.xml` を右クリック → **Maven → Reload project**  
   （`app` モジュールを IntelliJ に正しく認識させる）

2. Run Configurations に **「AppApplication (local)」** が自動追加されていることを確認  
   （`.idea/runConfigurations/AppApplication__local_.xml` を読み込んでいるはず）

3. 環境変数が設定されていることを確認（Run Configuration の Env vars タブ）：
   ```
   SPRING_PROFILES_ACTIVE=local
   POSTGRES_USER=ecuser
   POSTGRES_PASSWORD=ecpass
   POSTGRES_DB=ecdb
   MINIO_ROOT_USER=minioadmin
   MINIO_ROOT_PASSWORD=minioadmin
   ```

---

### STEP 4: 動作確認

```bash
# Docker でインフラのみ起動
docker compose up postgresdb minio localstack frontend -d

# IntelliJ から「AppApplication (local)」を実行
# → localhost:8888 でアクセスできることを確認
```

---

## よく使うコマンド

| 用途 | コマンド |
|------|---------|
| **ハイブリッド起動**（通常開発） | `docker compose up postgresdb minio localstack frontend -d` |
| **特定サービスのみ再起動** | `docker compose restart postgresdb` |
| **ログ確認** | `docker compose logs -f postgresdb` |

---

## 注意事項

- `application.properties` の `spring.datasource.url` は `postgresdb:5432`（Docker ホスト名）のまま。  
  `local` プロファイルで `localhost:5433` に上書きされる。
- `application.yml` の `aws.endpoint` は `http://minio:9000`（Docker ホスト名）のまま。  
  `application-local.yml` で `localhost:9000` に上書きされる。
- IntelliJ の自動ビルドは有効のままでOK。DevTools との競合は解消される。

---

## 移行後の補足メモ（実際にやって気づいたこと）

### プロパティの環境変数展開が効かない問題

`application-local.properties` で `${POSTGRES_USER}` のように書いても、  
IntelliJ の Run Configuration から JVM に環境変数が渡らず展開されない問題が発生した。

**対処：** ローカル開発用は直接値（`ecuser` / `ecpass` / `ecdb`）をハードコード。  
`.gitignore` に `application-local.properties` と `application-local.yml` を追加してコミット対象外にする。

```
# app/.gitignore に追加
src/main/resources/application-local.properties
src/main/resources/application-local.yml
```

### YAML プロファイルの設計方針

Spring Boot のプロパティ読み込み順：
1. `application.yml` を**常に**読む
2. `application-{profile}.yml` を**上に重ねる**（差分として適用）

**このプロジェクトの方針：**
- `application.yml` → 全環境共通の設定のみ（`region`, `bucket-name` など）
- `application-local.yml` → ローカル固有の全設定（endpoint, credentials）
- `application-prd.yml` → 本番固有の全設定（将来追加）

### デバッグ方法

IntelliJ から直接起動しているので、Run ボタンを **Debug ボタン（🐛）に変えるだけ**でデバッグ可能。  
Docker 経由の場合に必要だったリモートデバッグ設定は不要。

### テストの ApplicationContext ロード失敗

`AppApplicationTests` でプロファイル未指定のまま実行すると、  
DB 接続情報が解決できず `Failed to load ApplicationContext` エラーになる。

**対処：** `@ActiveProfiles("local")` をテストクラスに追加する。

```java
@SpringBootTest
@ActiveProfiles("local")
class AppApplicationTests {
    @Test
    void contextLoads() {}
}
```

> ⚠️ テストが localhost:5433 の Docker PostgreSQL に依存する点に注意。  
> 将来的には `@ActiveProfiles("test")` + H2 インメモリ DB 構成への移行を検討。

### DevTools とホットリロード

- `.java` ファイル変更 → IntelliJ auto-build → `target/classes` 更新 → DevTools が restart
- `.yml` / `.properties` 変更も同様に DevTools の restart 対象（classpath 上のリソースのため）
- 再起動が不要なのは静的リソース（`static/`, `templates/`）のみ（LiveReload が対応）
