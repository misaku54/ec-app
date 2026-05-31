import { useState } from "react";
import type { ApiListResponse } from "../types/ApiResponse";
import type { PageInfo } from "../types/PageInfo";
import type { Product } from "../types/Product";
import { useAxios } from "./useAixos";

// 商品一覧を取得するhooks
export const useAdmProduct = () => {
  const { isLoading, axiosInstance } = useAxios();
  const [products, setProducts] = useState<Product[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  const getProducts = (page: number = 1) => {
    axiosInstance
      .get<ApiListResponse<Product>>("/api/admin/product/list", {
        params: { page, size: 20 },
      })
      .then((res) => {
        setProducts(res.data.data);
        setPageInfo(res.data.pageInfo);
      })
      .catch(() => alert("商品一覧の抽出に失敗しました。"));
  };

  return { isLoading, products, getProducts, pageInfo };
};
