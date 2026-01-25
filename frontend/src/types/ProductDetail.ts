type ImageData = {
  s3Key: string;
  sortOrder: number;
  mainImage: boolean;
};

export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  productImageList: ImageData[];
  createdAt: string;
  updatedAt: string;
}