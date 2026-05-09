import { useCallback, useState } from "react";
import type { ApiResponse } from "../types/ApiResponse";
import type { ProductDetail } from "../types/ProductDetail";
import { useAxios } from "./useAixos";

// 商品詳細を取得するhooks
export const useSelectProduct = () => {
  const [selectedProduct, setSelectedProduct] =
    useState<ProductDetail | null>();
  const { isLoading, axiosInstance } = useAxios();

  const selectProduct = useCallback((id: string) => {
    axiosInstance
      .get<ApiResponse<ProductDetail>>(`/api/admin/product/${id}`)
      .then((res) => setSelectedProduct(res.data.data))
      .catch(() => console.log("商品詳細の取得に失敗しました"));
  }, []);
  return { isLoading, selectedProduct, selectProduct };
};
