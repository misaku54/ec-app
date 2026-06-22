export type Order = {
  orderId: number;
  totalAmount: number;
  status: string;
};

export type OrderCreateRequest = {
  shippingName: string;
  shippingPostalCode: string;
  shippingAddress: string;
  shippingPhone?: string;
  note?: string;
  items: { productId: number; quantity: number }[];
};

// この型の変数には、この5つの文字列のうちどれか1つしか入れられませんという型定義
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderHistoryItem = {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
};

export type OrderItemDetail = {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  currentImageS3Key: string | null;
};

export type OrderDetail = {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  shippingName: string;
  shippingPostalCode: string;
  shippingAddress: string;
  shippingPhone: string | null;
  note: string | null;
  createdAt: string;
  orderItems: OrderItemDetail[];
};
