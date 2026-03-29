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

  const { isLoading, axiosInstance } = useAxios(
    () => nagative("/admin/product/list"),
    () => setErrorMessage("ログインに失敗しました"),
  );

  const login = (data: LoginInput) => {
    axiosInstance.post("http://localhost:8888/login", data);
  };

  return {
    isLoading,
    errorMessage,
    login,
  };
};
