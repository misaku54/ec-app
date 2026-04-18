import { useCallback, useState } from "react";
import type { ProductDetail } from "../types/ProductDetail";
import { useAxios } from "./useAixos";

interface ResponseData {
  data: ProductDetail;
}
// 商品詳細を取得するhooks
export const useSelectProduct = () => {
  const [selectedProduct, setSelectedProduct] =
    useState<ProductDetail | null>();
  // const [loading, setLoading] = useState(false);
  const { isLoading, axiosInstance } = useAxios();

  // const selectProduct2 = useCallback((id: string) => {
  //   setLoading(true);
  //   axios.get<ResponseData>(`http://localhost:8888/api/admin/product/${id}`)
  //     .then((res) => setSelectedProduct(res.data.data))
  //     .catch(() => console.log("商品詳細の取得に失敗しました"))
  //     .finally(() => setLoading(false));
  // }, []);

  const selectProduct = useCallback((id: string) => {
    axiosInstance
      .get<ResponseData>(`/api/admin/product/${id}`)
      .then((res) => setSelectedProduct(res.data.data))
      .catch(() => console.log("商品詳細の取得に失敗しました"));
  }, []);
  return { isLoading, selectedProduct, selectProduct };
};
