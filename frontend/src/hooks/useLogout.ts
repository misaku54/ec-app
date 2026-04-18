import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
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
  const { clearMe } = useAuth();

  const logout = () => {
    axiosInstance
      .post<LogoutResponse>("/logout")
      .then(() => {
        clearMe();
        navigate("/");
      })
      .catch(() => setErrorMessage("ログアウトに失敗しました。"));
  };

  return {
    isLoading,
    errorMessage,
    logout,
  };
};
