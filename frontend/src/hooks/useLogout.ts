import { useState } from "react";
import { useNavigate } from "react-router";
import { useAxios } from "./useAixos";

type LogoutResponse = {
  message: string;
};

export const useLogout = (): {
  isLoading: boolean;
  errorMessage: string | null;
  logout: () => void;
} => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isLoading, axiosInstance } = useAxios();

  const logout = () => {
    axiosInstance
      .post<LogoutResponse>("/logout")
      .then(() => navigate("/"))
      .catch(() => setErrorMessage("ログアウトに失敗しました。"));
  };

  return {
    isLoading,
    errorMessage,
    logout,
  };
};
