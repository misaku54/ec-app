import { useCallback } from "react";
import { useNavigate } from "react-router";
import type { ProductDetail } from "../types/ProductDetail";
import { useAxios } from "./useAixos";

interface RequestBody {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageFiles: FileList;
}

interface ResponseData {
  data: ProductDetail;
}

// 商品登録するhooks
export const useCreateProduct = () => {
  const navigate = useNavigate();
  const { isLoading, axiosInstance } = useAxios();

  const createProduct = useCallback((requestBody: RequestBody) => {
    axiosInstance
      .post<ResponseData>("/api/admin/product/create", requestBody)
      .then((res) => {
        if (res.data.data.id && res.data.data.id > 0) {
          const id: number = res.data.data.id;
          navigate(`/admin/product/${id}`);
        } else {
          throw new Error("idが取得できませんでした");
        }
      })
      .catch(() => alert("商品の登録に失敗しました"));
  }, []);

  return { isLoading, createProduct };
};
