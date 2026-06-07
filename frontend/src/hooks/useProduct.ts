import type { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { ApiError, ApiResponse } from "../types/ApiResponse";
import type { ProductDetail } from "../types/ProductDetail";
import { useAxios } from "./useAixos";

export const useProduct = () => {
  const [product, setProduct] = useState<ProductDetail | null>();
  const { isLoading, axiosInstance } = useAxios();
  const navigate = useNavigate();

  const getProduct = (id: string) => {
    axiosInstance
      .get<ApiResponse<ProductDetail>>(`/api/public/product/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch((e: AxiosError<ApiError>) => {
        navigate("/products", {
          state: {
            message:
              e.response?.data?.error?.message ??
              "サーバーエラーが発生しました。",
            type: "error",
          },
        });
      });
  };

  return { isLoading, product, getProduct };
};
