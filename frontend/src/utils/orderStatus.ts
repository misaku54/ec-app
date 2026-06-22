import { type OrderStatus } from "../types/Order";

export const formatOrderStatus = (status: OrderStatus): string => {
  switch (status) {
    case "PENDING":
      return "注文受付中";
    case "CONFIRMED":
      return "注文受付中";
    case "SHIPPED":
      return "発送済み";
    case "DELIVERED":
      return "配達完了";
    case "CANCELLED":
      return "配達完了";
    default:
      return "";
  }
};
