import { useEffect, useState } from "react";
import { ApiClient } from "../api/ApiClient";
import type { Me } from "../types/Me";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [me, setMe] = useState<Me | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // ログインユーザー取得
  // ログイン直後にロールで遷移先を振り分けるため、取得した me を返す
  const fetchMe = (): Promise<Me | null> => {
    setIsAuthChecked(false);
    return ApiClient.get<{ status: string; data: Me }>("/api/me")
      .then((res) => {
        setMe(res.data.data);
        setIsAuthenticated(true);
        return res.data.data;
      })
      .catch(() => {
        setMe(null);
        setIsAuthenticated(false);
        return null;
      })
      .finally(() => {
        setIsAuthChecked(true);
      });
  };

  // ログインユーザー消去
  const clearMe = () => {
    setMe(null);
    setIsAuthenticated(false);
  };

  // Provider初回ロード時にmeを取得
  useEffect(() => {
    fetchMe();
  }, []);

  // me の変化を監視
  useEffect(() => {
    console.log(me); // me が更新されたタイミングで出力される
  }, [me]);

  return (
    <AuthContext.Provider value={{ me, isAuthenticated, isAuthChecked, fetchMe, clearMe }}>
      {children}
    </AuthContext.Provider>
  );
};
