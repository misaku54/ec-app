import { createContext, useContext } from "react";
import type { Me } from "../types/Me";

type AuthContextType = {
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  me: Me | null;
  fetchMe: () => void;
  clearMe: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthはAuthProvider内で使用する必要があります。");
  }
  return context;
};
