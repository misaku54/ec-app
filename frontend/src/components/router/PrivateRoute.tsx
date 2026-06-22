import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Loader } from "../atoms/loader/Loader";

export const PrivateRoute = () => {
  const { me, isAuthChecked } = useAuth();
  // fetchMe完了前はローダーを表示
  if (!isAuthChecked) {
    return <Loader />;
  }
  return me ? <Outlet /> : <Navigate to="/" replace />;
};
