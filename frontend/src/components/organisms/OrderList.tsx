import { useOrders } from "../../api/orders/get-orders";

export const OrderList = (page: number) => {
  const { data, isPending, error } = useOrders({ page: page });

  const orders = data?.data;
};
