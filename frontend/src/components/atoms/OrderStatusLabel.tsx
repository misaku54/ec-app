import type { OrderStatus } from "../../types/Order";
import { formatOrderStatus } from "../../utils/orderStatus";

const statusStyle: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-200 text-gray-600",
};

type Props = { status: OrderStatus };

export const OrderStatusLabel = ({ status }: Props) => (
  <span
    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[status]}`}
  >
    {formatOrderStatus(status)}
  </span>
);
