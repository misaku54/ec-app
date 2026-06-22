import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useCartStore } from "../stores/useCartStore";
import type { ApiError, ApiResponse } from "../types/ApiResponse";
import type { Order, OrderCreateRequest } from "../types/Order";
import { useAxios } from "./useAixos";

export const useCreateOrder = () => {
  const { isLoading, axiosInstance } = useAxios();
  const clearCart = useCartStore((state) => state.clearCart);
  const navigate = useNavigate();

  const createOrder = (form: OrderCreateRequest) => {
    return axiosInstance
      .post<ApiResponse<Order>>("/api/customer/order/create", form)
      .then((res) => {
        clearCart();
        navigate(`/order/complete/${res.data.data.orderId}`);
      })
      .catch((e: AxiosError<ApiError>) => {
        toast.error(
          e.response?.data?.error?.message ?? "サーバーエラーが発生しました。",
        );
      });
  };
  return { isLoading, createOrder };
};
