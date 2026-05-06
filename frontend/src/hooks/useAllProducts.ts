import { useState } from "react";
import type { Product } from "../types/Product";
import { useAxios } from "./useAixos";

interface ResponseData {
  data: Product[];
}

// 商品一覧を取得するhooks
export const useAllProduct = () => {
  const { isLoading, axiosInstance } = useAxios();
  const [products, setProducts] = useState<Product[]>([]);

  const getProducts = () => {
    axiosInstance
      .get<ResponseData>("/api/admin/product/list")
      .then((res) => setProducts(res.data.data))
      .catch(() => alert("商品一覧の抽出に失敗しました。"));
  };

  return { isLoading, products, getProducts };
};
