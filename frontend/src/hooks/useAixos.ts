import { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";
import { useState } from "react";
import { ApiClient } from "../api/ApiClinent";

// axiosカスタムフック
export const useAxios = (
  successCallBack: (response: AxiosResponse) => void,
  failedCallBack: (error: AxiosError) => void,
): { isLoading: boolean; axiosInstance: AxiosInstance } => {
  const axiosInstance = ApiClient;

  const [isLoading, setIsLoading] = useState(false);

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
      return Promise.reject(error);
    },
  );

  return {
    isLoading,
    axiosInstance,
  };
};
