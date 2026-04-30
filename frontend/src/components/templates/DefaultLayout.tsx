import { Outlet } from "react-router";
import { Footer } from "../atoms/Footer";
import { Header } from "../organisms/Header";

export const DefaultLayout: React.FC = () => {
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
