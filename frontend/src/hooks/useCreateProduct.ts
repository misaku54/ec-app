import type { ApiResponse } from "../types/ApiResponse";
import type { ProductDetail } from "../types/ProductDetail";
import { useAxios } from "./useAixos";

interface RequestBody {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageFiles: FileList;
}

// 商品登録するhooks
export const useCreateProduct = () => {
  const { isLoading, axiosInstance } = useAxios();

  const toFormData = (requestBody: RequestBody) => {
    const formData = new FormData();
    formData.append("name", requestBody.name);
    formData.append("price", String(requestBody.price));
    formData.append("stock", String(requestBody.stock));
    formData.append("description", requestBody.description);
    if (requestBody.imageFiles.length > 0) {
      for (const file of requestBody.imageFiles) {
        formData.append("imageFiles", file);
      }
    }
    return formData;
  };

  const createProduct = (requestBody: RequestBody) => {
    return axiosInstance
      .post<ApiResponse<ProductDetail>>("/api/admin/product/create", toFormData(requestBody))
      .then((res) => {
        if (res.data.data.id && res.data.data.id > 0) {
          return res.data.data.id;
        } else {
          throw new Error("idが取得できませんでした");
        }
      })
      .catch((e) => {
        throw e;
      });
  };

  return { isLoading, createProduct };
};
