import { useState } from "react";
import type { ProductDelete } from "../types/ProductDelete";
import { useAxios } from "./useAixos";

interface RequestBody {
  id: number;
}

interface ResponseData {
  message: string;
  data: ProductDelete;
}

// 商品削除するhooks
export const useDeleteProduct = () => {
  const { isLoading, axiosInstance } = useAxios();
  const [deletedProduct, setDeletedProduct] = useState<ProductDelete | null>();

  const deleteProduct = (id: number) => {
    const requestBody: RequestBody = { id };

    axiosInstance
      .post<ResponseData>("/api/admin/product/delete", requestBody)
      .then((res) => setDeletedProduct(res.data.data))
      .catch(() => alert("商品の削除に失敗しました"));
  };

  return { isLoading, deletedProduct, deleteProduct };
};
