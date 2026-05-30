import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";

export const AdminRoute = () => {
  const { me } = useAuth();

  return me?.roles.includes("ADMIN") ? <Outlet /> : <Navigate to="/" replace />;
};
