import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { ApiError, ApiListResponse } from "../types/ApiResponse";
import type { SearchForm } from "../types/Form";
import type { PageInfo } from "../types/PageInfo";
import type { Product } from "../types/Product";
import { useAxios } from "./useAixos";

export const useProducts = () => {
  const { isLoading, axiosInstance } = useAxios();
  const [products, setProducts] = useState<Product[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);

  const getProducts = (page: number = 1, searchForm?: SearchForm) => {
    axiosInstance
      .get<ApiListResponse<Product>>("/api/public/product/list", {
        params: {
          page,
          size: 20,
          ...(searchForm?.name != null && { name: searchForm.name }),
          ...(searchForm?.maxPrice != null && {
            maxPrice: searchForm.maxPrice,
          }),
          ...(searchForm?.minPrice != null && {
            minPrice: searchForm.minPrice,
          }),
          ...(searchForm?.inStock != null && {
            inStock: searchForm.inStock,
          }),
        },
      })
      .then((res) => {
        setProducts(res.data.data);
        setPageInfo(res.data.pageInfo);
      })
      .catch((e: AxiosError<ApiError>) => {
        toast.error(
          e.response?.data?.error?.message ?? "サーバーエラーが発生しました。",
        );
      });
  };

  return { isLoading, products, getProducts, pageInfo };
};
