const S3_BASE_URL = "http://localhost:9000/your-bucket";

export const NO_IMAGE_URL = `${S3_BASE_URL}/noImage.png`;

export const buildProductImageUrl = (s3Key?: string | null): string =>
  s3Key ? `${S3_BASE_URL}/${s3Key}` : NO_IMAGE_URL;
