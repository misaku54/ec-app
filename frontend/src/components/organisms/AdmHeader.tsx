import { Link } from "react-router";
import { useLogout } from "../../hooks/useLogout";
import { Button } from "../atoms/button/Button";

export const AdmHeader = () => {
  const { logout } = useLogout();

  return (
    <header className="bg-zinc-900 text-white border-b border-zinc-700">
      <div className="container mx-auto flex flex-wrap px-6 py-4 flex-col md:flex-row items-center">
        <Link
          to="/admin/products"
          className="flex items-center mb-4 md:mb-0 select-none"
        >
          <span className="text-xs font-light tracking-[0.3em] text-zinc-400 uppercase">
            ECDEMO 管理画面
          </span>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-sm justify-center gap-6">
          <Link
            to="/admin/products"
            className="text-zinc-400 hover:text-white transition-colors tracking-wide"
          >
            商品管理
          </Link>
          <Link
            to="/admin/products/create"
            className="text-zinc-400 hover:text-white transition-colors tracking-wide"
          >
            商品登録
          </Link>
        </nav>

        <Button
          onClick={logout}
          className="inline-flex items-center gap-2 ml-6 border border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-400 py-1.5 px-4 rounded text-sm transition-colors mt-4 md:mt-0"
        >
          ログアウト
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </Button>
      </div>
    </header>
  );
};
