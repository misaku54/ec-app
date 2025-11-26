export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category?: string;
  stock?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}