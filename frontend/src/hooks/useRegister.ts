import type { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { ApiError } from "../types/ApiResponse";
import type { RegisterForm } from "../types/Form";
import { useAxios } from "./useAixos";

export const useRegsiter = (): {
  isLoading: boolean;
  errorMessage: string | null;
  register: (requestBody: RegisterForm) => void;
} => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isLoading, axiosInstance } = useAxios();

  const register = (requestBody: RegisterForm) => {
    axiosInstance
      .post("/api/public/register", requestBody)
      .then(() => {
        navigate("/");
      })
      .catch((e: AxiosError<ApiError>) => {
        if (e.response) {
          setErrorMessage(e.response.data.error.message);
        } else {
          // どうするべきか
          console.log("500");
        }
      });
  };

  return {
    isLoading,
    errorMessage,
    register,
  };
};
