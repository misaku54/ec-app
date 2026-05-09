import { useState } from "react";
import type { PageInfo } from "../types/PageInfo";
import type { Product } from "../types/Product";
import { useAxios } from "./useAixos";

interface ResponseData {
  data: Product[];
  pageInfo: PageInfo;
}

// 商品一覧を取得するhooks
export const useAllProduct = () => {
  const { isLoading, axiosInstance } = useAxios();
  const [products, setProducts] = useState<Product[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  const getProducts = (page: number = 1) => {
    axiosInstance
      .get<ResponseData>("/api/admin/product/list", {
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
