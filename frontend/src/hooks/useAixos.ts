import { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ApiClient } from "../api/ApiClient";

// axiosカスタムフック
export const useAxios = (
  successCallBack?: (response: AxiosResponse) => void,
  failedCallBack?: (error: AxiosError) => void,
): { isLoading: boolean; axiosInstance: AxiosInstance } => {
  const axiosInstance = ApiClient;
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // リクエストのインターセプター設定
  axiosInstance.interceptors.request.use((request) => {
    setIsLoading(true);
    return request;
  });

  // レスポンスのインターセプター設定
  axiosInstance.interceptors.response.use(
    (response) => {
      setIsLoading(false);
      if (typeof successCallBack === "function") {
        successCallBack(response);
      }
      return response;
    },
    (error) => {
      setIsLoading(false);
      if (typeof failedCallBack === "function") {
        failedCallBack(error);
      }
      if (error.status === 401) {
        navigate("/", {
          state: { message: "ログインしてください", type: "error" },
        });
        return;
      }
      if (error.status === 403) {
        navigate("/", {
          state: { message: "権限がありません", type: "error" },
        });
        return;
      }
      return Promise.reject(error);
    },
  );

  return {
    isLoading,
    axiosInstance,
  };
};
