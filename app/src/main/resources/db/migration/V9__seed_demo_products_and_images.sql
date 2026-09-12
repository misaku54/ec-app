-- デモ商品の追加と商品画像の登録。
-- ページネーション（1ページ20件）の動作を確認できるよう、合計24件にする。
-- 画像は docker/minio/seed-images/ を createbuckets コンテナが MinIO に配置しており、
-- ここではそのオブジェクトキーを s3_files に登録する。
-- 何度流しても重複しないよう、商品名とオブジェクトキーで存在チェックを行う。

INSERT INTO products (name, description, price, stock)
SELECT v.name, v.description, v.price, v.stock
FROM (VALUES
  (1,  'ウィークエンダーボストンバッグ', '1泊2日の荷物が収まるボストンバッグ。オイルドレザーの経年変化を楽しめます。', 32800, 6),
  (2,  'ヴィンテージメッセンジャー',     'あえてムラを残した仕上げのメッセンジャーバッグ。13インチPCが収まります。', 28600, 4),
  (3,  'ミニショルダー グレー',          'スマホと財布だけを持ち歩くための小型ショルダー。上品なグレー。', 15800, 14),
  (4,  'ウーブンレザートート',           '編み込みレザーのトートバッグ。チェーンハンドルを付け替えられます。', 36800, 3),
  (5,  'バケットバッグ キャメル',        '柔らかいレザーを使った巾着型のバケットバッグ。肩掛けにも対応。', 21800, 9),
  (6,  'クロコ型押しミニバッグ',         'クロコダイル型押しのミニショルダー。パーティーシーンにも合わせやすい一点。', 18900, 5),
  (7,  'ボストンハンドバッグ',           'しっかり自立するハンドバッグ。通勤バッグとしても使える大きさです。', 27800, 7),
  (8,  'デイリーバックパック',           'バーガンディのレザーバックパック。デイリーユースにちょうどいい容量。', 23800, 11),
  (9,  'ミニリュック ブラック',          'ドローストリング仕様のミニリュック。お出かけ用の小さめサイズ。', 16800, 16),
  (10, 'スクエアボストン ブラック',      'かっちりとした型の小ぶりなボストンバッグ。ハンドルとショルダーの2WAY。', 25800, 6),
  (11, '長財布 ブラウン',                '札入れ2室・カード12枚収納。使い込むほど手に馴染む長財布。', 18600, 13),
  (12, '薄型カードホルダー',             'ジャケットの内ポケットに収まる薄型カードホルダー。カード6枚収納。', 7800, 22),
  (13, '二つ折り財布 ブラック',          'シンプルな黒の二つ折り財布。小銭入れ付きで普段使いに。', 13800, 17),
  (14, 'ラウンドファスナー財布',         'ぐるりと開くラウンドファスナータイプ。中身が見渡せて使いやすい形。', 19800, 8),
  (15, '編み込みレザーベルト',           'メッシュ編みのレザーベルト。穴の位置に縛られずウエストを調整できます。', 11800, 12),
  (16, 'コスメポーチ',                   'マチが広く自立するコスメポーチ。内側は汚れを拭き取りやすい素材。', 5800, 0)
) AS v(sort, name, description, price, stock)
WHERE NOT EXISTS (
  SELECT 1 FROM products p WHERE p.name = v.name
)
ORDER BY v.sort;

-- 商品画像（レザーキーケースのみ画像なし = NO_IMAGE 表示の確認用）
INSERT INTO s3_files (entity_type, entity_id, s3_key, sort_order, is_main_image)
SELECT 1, p.id, v.s3_key, v.sort_order, v.is_main
FROM (VALUES
  ('レザートートバッグ',             'seed/tote-tan.jpg',             0, TRUE),
  ('レザートートバッグ',             'seed/tote-woven.jpg',           1, FALSE),
  ('キャンバスショルダー',           'seed/shoulder-beige.jpg',       0, TRUE),
  ('ミニマル二つ折り財布',           'seed/wallet-slim.jpg',          0, TRUE),
  ('ミニマル二つ折り財布',           'seed/wallet-slim-2.jpg',        1, FALSE),
  ('ミニマル二つ折り財布',           'seed/wallet-slim-3.jpg',        2, FALSE),
  ('ビジネスリュック',               'seed/backpack-business.jpg',    0, TRUE),
  ('ビジネスリュック',               'seed/backpack-business-2.jpg',  1, FALSE),
  ('カードケース',                   'seed/cardcase-brown.jpg',       0, TRUE),
  ('カードケース',                   'seed/cardcase-brown-2.jpg',     1, FALSE),
  ('レザーベルト 35mm',              'seed/belt-brown.jpg',           0, TRUE),
  ('レザーベルト 35mm',              'seed/belt-brown-2.jpg',         1, FALSE),
  ('レザーベルト 35mm',              'seed/belt-brown-3.jpg',         2, FALSE),
  ('トラベルポーチ',                 'seed/pouch-travel.jpg',         0, TRUE),
  ('ウィークエンダーボストンバッグ', 'seed/boston-weekender.jpg',     0, TRUE),
  ('ヴィンテージメッセンジャー',     'seed/messenger-vintage.jpg',    0, TRUE),
  ('ミニショルダー グレー',          'seed/shoulder-gray.jpg',        0, TRUE),
  ('ウーブンレザートート',           'seed/shoulder-flap.jpg',        0, TRUE),
  ('バケットバッグ キャメル',        'seed/bucket-camel.jpg',         0, TRUE),
  ('クロコ型押しミニバッグ',         'seed/minibag-croco.jpg',        0, TRUE),
  ('ボストンハンドバッグ',           'seed/handbag-brown.jpg',        0, TRUE),
  ('デイリーバックパック',           'seed/backpack-burgundy.jpg',    0, TRUE),
  ('ミニリュック ブラック',          'seed/backpack-mini-black.jpg',  0, TRUE),
  ('スクエアボストン ブラック',      'seed/boston-black.jpg',         0, TRUE),
  ('長財布 ブラウン',                'seed/wallet-long-brown.jpg',    0, TRUE),
  ('長財布 ブラウン',                'seed/wallet-long-brown-2.jpg',  1, FALSE),
  ('薄型カードホルダー',             'seed/cardholder-slim.jpg',      0, TRUE),
  ('二つ折り財布 ブラック',          'seed/wallet-bifold-black.jpg',  0, TRUE),
  ('ラウンドファスナー財布',         'seed/wallet-zip-round.jpg',     0, TRUE),
  ('編み込みレザーベルト',           'seed/belt-braided.jpg',         0, TRUE),
  ('コスメポーチ',                   'seed/pouch-cosme.jpg',          0, TRUE)
) AS v(product_name, s3_key, sort_order, is_main)
JOIN products p ON p.name = v.product_name AND p.del_flg = FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM s3_files f
  WHERE f.entity_type = 1 AND f.entity_id = p.id AND f.s3_key = v.s3_key
);
