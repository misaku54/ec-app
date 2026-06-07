import { useEffect } from "react";
import toast from "react-hot-toast";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Footer } from "../atoms/Footer";
import { Header } from "../organisms/Header";

export const DefaultLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.message) {
      if (location.state.type === "error") {
        toast.error(location.state.message);
      } else {
        toast.success(location.state.message);
      }
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Header />
      <main className="container mx-auto px-6 py-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
