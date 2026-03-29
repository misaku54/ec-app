import type { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAxios } from "./useAixos";

type LoginInput = {
  email: string;
  password: string;
};

export const useLogin = (): {
  isLoading: boolean;
  errorMessage: string | null;
  login: (data: LoginInput) => void;
} => {
  const nagative = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { isLoading, axiosInstance } = useAxios();

  const login = (data: LoginInput) => {
    axiosInstance
      .post("http://localhost:8888/login", data)
      .then(() => nagative("/admin/product/list"))
      .catch((error: AxiosError) => {
        if (error.response?.status === 403) {
          setErrorMessage("メールアドレスまたはパスワードが間違っています");
        } else {
          setErrorMessage("サーバーエラーが発生しました");
        }
      });
  };

  return {
    isLoading,
    errorMessage,
    login,
  };
};
