import { useLogout } from "../../hooks/useLogout";
import { Button } from "../atoms/button/Button";

export const Header: React.FC = () => {
  const { isLoading, errorMessage, logout } = useLogout();
  return (
    <header>
      <header className="text-white body-font bg-indigo-600">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <a className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-10 h-10 text-indigo-600 p-2 bg-white rounded-full"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-3 text-xl font-bold">管理画面</span>
          </a>
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
            <a className="mr-5 text-indigo-100 hover:text-white">First Link</a>
            <a className="mr-5 text-indigo-100 hover:text-white">Second Link</a>
            <a className="mr-5 text-indigo-100 hover:text-white">Third Link</a>
            <a className="mr-5 text-indigo-100 hover:text-white">Fourth Link</a>
          </nav>
          {/* <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
            ログアウト
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button> */}
          <Button
            onClick={logout}
            className="inline-flex items-center bg-white text-indigo-600 border-0 py-1 px-3 focus:outline-none hover:bg-indigo-50 rounded text-base mt-4 md:mt-0 font-semibold"
          >
            ログアウト
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </Button>
        </div>
      </header>
    </header>
  );
};
