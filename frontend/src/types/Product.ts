export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  productImageList: ImageData[];
  createdAt: string;
  updatedAt: string;
}
