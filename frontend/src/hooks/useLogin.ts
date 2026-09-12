import type { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
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
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isLoading, axiosInstance } = useAxios();
  const { fetchMe } = useAuth();

  const login = (data: LoginInput) => {
    axiosInstance
      .post("http://localhost:8888/login", data)
      .then(() => fetchMe())
      .then((me) => {
        // 管理者は管理画面、会員は商品一覧へ
        navigate(me?.roles.includes("ADMIN") ? "/admin/products" : "/products");
      })
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
