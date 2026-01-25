import type { ImageData } from '../types/ImageData';

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