import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api-client";
import type { QueryConfig } from "../../lib/react-query";
import type { OrderDetail } from "../../types/Order";

// fetcher: axios を叩くだけの純粋関数。interceptor が response.data を返すので戻り値は { data: OrderDetail }
export const getOrder = (
  id: number,
): Promise<{
  data: OrderDetail;
}> => api.get(`/api/customer/order/${id}`);

// queryKey + queryFn の組。queryKey は REST 構造に対応（'detail' は詳細系を表す種別セグメント）
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
  // queryConfig: queryKey/queryFn 以外の useQuery オプション（staleTime? enabled? 等・全部任意）を上書きできる口。
  queryConfig?: QueryConfig<typeof getOrderQueryOptions>;
}) => useQuery({ ...getOrderQueryOptions({ id }), ...queryConfig });
