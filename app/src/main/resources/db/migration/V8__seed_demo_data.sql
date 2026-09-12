-- デモ用の初期データ。
-- クローン直後の環境でもログイン・商品閲覧・購入フローを一通り試せる状態にする。
-- パスワードはいずれも "password"（BCrypt strength 10 でハッシュ化済み）。
-- 何度流しても重複しないよう、メールアドレス / 商品名で存在チェックを行う。

-- 管理者・会員アカウント
INSERT INTO accounts (name, email, password) VALUES
  ('デモ管理者', 'admin@example.com', '$2a$10$vmWnwKQ9/qhPdSWoVeTSteMs/GE/inFGvt4I8Mk88BWpBmDjOVEty'),
  ('デモ会員',   'user@example.com',  '$2a$10$vmWnwKQ9/qhPdSWoVeTSteMs/GE/inFGvt4I8Mk88BWpBmDjOVEty')
ON CONFLICT (email) DO NOTHING;

INSERT INTO account_roles (account_id, role_id)
SELECT a.id, r.id
FROM accounts a
JOIN roles r ON r.name = 'ADMIN'
WHERE a.email = 'admin@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO account_roles (account_id, role_id)
SELECT a.id, r.id
FROM accounts a
JOIN roles r ON r.name = 'USER'
WHERE a.email = 'user@example.com'
ON CONFLICT DO NOTHING;

-- 会員のお届け先
INSERT INTO addresses (account_id, name, postal_code, address, phone)
SELECT a.id, 'デモ会員', '150-0001', '東京都渋谷区神宮前1-1-1 デモマンション101', '09012345678'
FROM accounts a
WHERE a.email = 'user@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM addresses ad WHERE ad.account_id = a.id
  );

-- V1 で投入したプレースホルダ商品は一覧から除外する
UPDATE products SET del_flg = TRUE WHERE name IN ('product_name', 'product_name2');

-- デモ商品
-- 採番を安定させるため sort 順に INSERT する
INSERT INTO products (name, description, price, stock)
SELECT v.name, v.description, v.price, v.stock
FROM (VALUES
  (1, 'レザートートバッグ',     'イタリア産の牛革を使用した A4 対応トートバッグ。使うほどに艶が増します。', 24800, 12),
  (2, 'キャンバスショルダー',   '撥水加工を施した厚手キャンバスのショルダーバッグ。通勤・通学どちらにも。', 9800, 30),
  (3, 'ミニマル二つ折り財布',   'カード6枚と札入れのみに絞った薄型設計。ポケットに収まる二つ折り財布。', 12600, 20),
  (4, 'レザーキーケース',       '真鍮フックを4連備えたキーケース。ギフトにも選ばれる定番モデル。', 5400, 45),
  (5, 'ビジネスリュック',       'PC15インチ収納・背面ファスナー付き。出張にも使える大容量リュック。', 19800, 8),
  (6, 'カードケース',           '名刺約30枚を収納できるスリムなカードケース。内側は起毛素材で保護。', 6800, 25),
  (7, 'レザーベルト 35mm',      'バックルを交換できる35mm幅のレザーベルト。ウエスト調整可能。', 8900, 18),
  (8, 'トラベルポーチ',         '充電器やケーブルをまとめられる仕切り付きのトラベルポーチ。', 4200, 0)
) AS v(sort, name, description, price, stock)
WHERE NOT EXISTS (
  SELECT 1 FROM products p WHERE p.name = v.name
)
ORDER BY v.sort;
