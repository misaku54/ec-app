import { Outlet } from "react-router";
import { Footer } from "../atoms/Footer";
import { Header } from "../organisms/Header";

export const DefaultLayout: React.FC = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
