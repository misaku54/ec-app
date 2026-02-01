import axios from "axios";
import { useCallback, useState } from "react";
import type { ProductDelete } from "../types/ProductDelete";

interface RequestBody {
  id: number;
}

interface ResponseData {
  message: string;
  data: ProductDelete;
}

// 商品削除するhooks
export const useDeleteProduct = () => {
  const [loading, setLoading] = useState(false);
  const [deletedProduct, setDeletedProduct] = useState<ProductDelete | null>();

  const deleteProduct = useCallback((id: number) => {
    setLoading(true);

    const requestBody: RequestBody = { id };

    axios
      .post<ResponseData>(
        "http://localhost:8888/api/admin/product/delete",
        requestBody,
      )
      .then((res) => setDeletedProduct(res.data.data))
      .catch(() => alert("商品の削除に失敗しました"))
      .finally(() => setLoading(false));
  }, []);

  return { loading, deletedProduct, deleteProduct };
};
