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
