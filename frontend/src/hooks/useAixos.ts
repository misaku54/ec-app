import { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
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

  // interceptor の ID を ref で管理し、再レンダリングで積み重なるのを防ぐ
  const requestInterceptorId = useRef<number | null>(null);
  const responseInterceptorId = useRef<number | null>(null);

  useEffect(() => {
    // 既存の interceptor を eject してから再登録
    if (requestInterceptorId.current !== null) {
      axiosInstance.interceptors.request.eject(requestInterceptorId.current);
    }
    if (responseInterceptorId.current !== null) {
      axiosInstance.interceptors.response.eject(responseInterceptorId.current);
    }

    requestInterceptorId.current = axiosInstance.interceptors.request.use(
      (request) => {
        setIsLoading(true);
        return request;
      },
    );

    responseInterceptorId.current = axiosInstance.interceptors.response.use(
      (response) => {
        setIsLoading(false);
        if (typeof successCallBack === "function") {
          successCallBack(response);
        }
        return response;
      },
      (error: AxiosError) => {
        setIsLoading(false);
        if (typeof failedCallBack === "function") {
          failedCallBack(error);
        }

        // /api/me と /login は認証チェック用なのでリダイレクト対象外
        const url = error.config?.url ?? "";
        const isAuthCheckRequest =
          url.includes("/api/me") || url.includes("/login");

        if (!isAuthCheckRequest) {
          if (error.response?.status === 401) {
            navigate("/", {
              state: { message: "ログインしてください", type: "error" },
            });
            return;
          }
          if (error.response?.status === 403) {
            navigate("/", {
              state: { message: "権限がありません", type: "error" },
            });
            return;
          }
        }

        return Promise.reject(error);
      },
    );

    // アンマウント時に interceptor を解除
    return () => {
      if (requestInterceptorId.current !== null) {
        axiosInstance.interceptors.request.eject(requestInterceptorId.current);
      }
      if (responseInterceptorId.current !== null) {
        axiosInstance.interceptors.response.eject(responseInterceptorId.current);
      }
    };
  }, [navigate]);

  return {
    isLoading,
    axiosInstance,
  };
};
