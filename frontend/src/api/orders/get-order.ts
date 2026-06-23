import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api-client";
import type { QueryConfig } from "../../lib/react-query";
import type { OrderDetail } from "../../types/Order";

export const getOrder = (
  id: number,
): Promise<{
  data: OrderDetail;
}> => api.get(`/api/customer/order/${id}`);

export const getOrderQueryOptions = ({ id }: { id: number }) =>
  queryOptions({
    queryKey: ["orders", "detail", id],
    queryFn: () => getOrder(id),
  });

export const useOrder = ({
  id,
  queryConfig,
}: {
  id: number;
  queryConfig?: QueryConfig<typeof getOrderQueryOptions>;
}) => useQuery({ ...getOrderQueryOptions({ id }), ...queryConfig });
