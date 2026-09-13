const S3_BASE_URL = "http://localhost:9000/your-bucket";

// 代替画像はフロントエンドの静的ファイル。MinIO に置くとバケットの中身に依存して壊れるため
export const NO_IMAGE_URL = "/no-image.svg";

export const buildProductImageUrl = (s3Key?: string | null): string =>
  s3Key ? `${S3_BASE_URL}/${s3Key}` : NO_IMAGE_URL;
