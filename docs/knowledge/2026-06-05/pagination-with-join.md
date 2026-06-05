# ページネーションする SQL で JOIN（1対多）を書くな

> 書いた日: 2026-06-05
> 関連コード: `app/src/main/resources/mapper/ProductMapper.xml` の `searchProducts` / `findImagesByProductId`
> 関連 commit: 商品一覧の SQL 修正

---

## 症状

商品一覧画面で、**最初と最後のページだけ商品が18件しか表示されない**（中間ページは20件出る）。

ログを見ると：
- API が返している商品は実際に18件
- SQL の `LIMIT` は 20、`Total: 20` と出ている → SQL レベルでは20行返ってきている

つまり「SQL が20行返してるのに、商品としては18件にしかならない」。

---

## 原因

`searchProducts` の SQL が `products LEFT JOIN S3_files` で**画像を一緒に取りに行っていた**こと。

PageHelper は SQL の末尾に `LIMIT 20` を付けるだけ。
JOIN によって1商品が複数行になる結果セットに `LIMIT 20` がかかるので、画像が複数枚ある商品が混じると、20行内に詰められるユニークな商品が減る。

```
JOIN 後の結果（1商品が複数行）
─────────────────────────────
product 13 × image1   ← 1行目
product 13 × image2   ← 2行目  ← 画像3枚で3行食う
product 13 × image3   ← 3行目
product 14            ← 4行目
...
LIMIT 20 で打ち切り → ユニークな商品は18件
```

中間ページは画像複数の商品が混じってなければ20件出るので、「最初と最後だけ少ない」という症状になった。

---

## 修正

ページネーションする SQL は **親テーブル単体（products のみ）** に効かせて、子（画像）は別クエリで取り、MyBatis の `<collection select="...">` で紐づける。

```xml
<!-- ① 商品一覧（PageHelper はここの LIMIT のみに作用） -->
<select id="searchProducts" resultMap="productListResultMap">
  SELECT id, name, description, price, stock, ...
  FROM products
  WHERE ...
  ORDER BY id
</select>

<!-- ② 商品IDで画像を取得（PageHelper はかからない） -->
<select id="findImagesByProductId" resultMap="productImage">
  SELECT s3_key, sort_order, is_main_image
  FROM S3_files
  WHERE entity_id = #{productId}
    AND entity_type = 1
    AND del_flg = false
  ORDER BY sort_order ASC
</select>

<!-- ③ collection の select 属性で MyBatis が自動で②を呼ぶ -->
<resultMap id="productListResultMap" type="ProductDetailDto">
  <id property="id" column="id"/>
  ...
  <collection property="productImageList"
              select="findImagesByProductId"
              column="id"/>
</resultMap>
```

これで `LIMIT 20` が確実に「商品20件」に効くようになる。

---

## 単体取得（詳細画面）は JOIN でOK

`getProductDetailById` のような **1件取得** はページネーションしないので JOIN でも問題ない。むしろクエリ1発で済むので JOIN の方が効率が良い。

JOIN を避けるべきなのは **「ページネーションする一覧取得」のときだけ**。

---

## 教訓

> **ページネーションする SQL では 1対多 の JOIN を書くな。**
> 親テーブル単体に LIMIT を効かせて、子は別クエリで紐づける（MyBatis なら `<collection select=>`）。

### なぜ気付きにくいか

- データの並びによっては「中間ページは正常」なので、開発中の小さなテストデータでは再現しない
- ログを見ても `LIMIT 20` / `Total: 20` で SQL レベルでは正しく見える
- 「件数が変だな」と気付いてから JOIN が原因と特定するまでに時間がかかる

### チェック観点

新しい一覧 API を作るときに自問する：
- [ ] この SQL は LEFT JOIN を含んでいるか？
- [ ] JOIN 先は 1対多 の関係か？
- [ ] PageHelper を適用するか？
- [ ] 全部 YES なら → 子は別クエリに分ける

---

## 参考: なぜ PageHelper はこういう挙動なのか

PageHelper は MyBatis の SQL を**インターセプトして末尾に LIMIT を付けるだけ**のシンプルなプラグイン。SQL の意味は理解していないので、JOIN しているかどうかに関係なく機械的に LIMIT を加える。

つまり PageHelper のバグではなく、**JOIN した SQL に対して LIMIT をかけるのが SQL として正しくない**だけ。生 SQL でも同じ問題が起きる。
