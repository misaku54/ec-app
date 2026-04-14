import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Loader } from "../atoms/loader/Loader";

export const PrivateRoute = () => {
  const { me, isAuthenticated } = useAuth();
  // ログインされていてかつ管理権限を持っている場合
  if (!isAuthenticated) {
    return <Loader />;
  }
  return me?.roles.includes("ADMIN") ? <Outlet /> : <Navigate to="/" replace />;
};
