-- V3 の内容が全行コメントアウトされたまま適用されたため、
-- 新規構築した DB では s3_files が旧スキーマ（s3_path のみ）のままになり、
-- ProductMapper.findImagesByProductId（s3_key / sort_order / is_main_image を参照）が実行時エラーになる。
-- 既存の開発 DB は手動 ALTER 済みのため、何度流しても安全なように条件付きで適用する。

-- 動的参照のため複合ユニーク制約は不要
ALTER TABLE s3_files DROP CONSTRAINT IF EXISTS s3_files_entity_type_entity_id_key;

-- S3_PATH -> S3_KEY へのリネーム（未適用の場合のみ）
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 's3_files' AND column_name = 's3_path'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 's3_files' AND column_name = 's3_key'
  ) THEN
    ALTER TABLE s3_files RENAME COLUMN s3_path TO s3_key;
  END IF;
END $$;

ALTER TABLE s3_files ALTER COLUMN s3_key TYPE TEXT;

ALTER TABLE s3_files ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;
ALTER TABLE s3_files ADD COLUMN IF NOT EXISTS is_main_image BOOLEAN NOT NULL DEFAULT FALSE;
