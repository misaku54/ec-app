import { Link } from "react-router";
import { useLogout } from "../../hooks/useLogout";
import { useCartStore } from "../../stores/useCartStore";
import { Button } from "../atoms/button/Button";

export const CustomerHeader = () => {
  const { logout } = useLogout();
  const cart = useCartStore((state) => state.cart);
  const cartCount = cart.reduce((sum, item) => sum + item.count, 0);

  return (
    <header className="bg-zinc-900 text-white border-b border-zinc-700">
      <div className="container mx-auto flex flex-wrap px-6 py-4 flex-col md:flex-row items-center">
        <Link to="/products" className="flex items-center mb-4 md:mb-0 select-none">
          <span className="text-xs font-light tracking-[0.3em] text-zinc-400 uppercase">
            ECDEMO
          </span>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-sm justify-center gap-6">
          <Link
            to="/products"
            className="text-zinc-400 hover:text-white transition-colors tracking-wide"
          >
            商品一覧
          </Link>
        </nav>

        <Link
          to="/cart"
          className="relative ml-6 text-zinc-400 hover:text-white transition-colors mt-4 md:mt-0"
        >
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-5 h-5"
            viewBox="0 0 24 24"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 01-8 0"></path>
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-zinc-900 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </Link>

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
