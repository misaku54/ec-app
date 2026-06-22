import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api-client";
import type { QueryConfig } from "../../lib/react-query";
import type { OrderHistoryItem } from "../../types/Order";
import type { PageInfo } from "../../types/PageInfo";
export const getOrders = (
  page: number = 1,
): Promise<{
  data: OrderHistoryItem[];
  pageInfo: PageInfo;
}> => api.get("/api/customer/order/list", { params: { page } });

export const getOrdersQueryOptions = ({ page }: { page?: number } = {}) =>
  queryOptions({
    queryKey: page ? ["orders", { page }] : ["orders"],
    queryFn: () => getOrders(page),
  });

export const useOrders = ({
  page,
  queryConfig,
}: {
  page?: number;
  queryConfig?: QueryConfig<typeof getOrdersQueryOptions>;
} = {}) => useQuery({ ...getOrdersQueryOptions({ page }), ...queryConfig });
