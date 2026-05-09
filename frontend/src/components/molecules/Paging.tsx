import type { PageInfo } from "../../types/PageInfo";

type Props = {
  pageInfo: PageInfo;
  onPageChange: (page: number) => void;
};

export const Paging = ({ pageInfo, onPageChange }: Props) => {
  const isPrevDisabled = pageInfo.currentPage <= 1;
  const isNextDisabled = pageInfo.currentPage >= pageInfo.totalPage;

  const basePageBtn =
    "w-9 h-9 text-sm rounded transition-colors";
  const activePageBtn =
    "bg-zinc-800 text-white font-semibold";
  const inactivePageBtn =
    "text-zinc-600 hover:bg-zinc-100";
  const navBtn =
    "px-3 h-9 text-sm rounded border border-zinc-200 transition-colors";
  const navBtnEnabled =
    "text-zinc-700 hover:bg-zinc-100";
  const navBtnDisabled =
    "text-zinc-300 cursor-not-allowed";

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(pageInfo.currentPage - 1)}
        disabled={isPrevDisabled}
        className={`${navBtn} ${isPrevDisabled ? navBtnDisabled : navBtnEnabled}`}
      >
        前へ
      </button>

      {Array.from({ length: pageInfo.totalPage }, (_, i) => {
        const page = i + 1;
        const isActive = page === pageInfo.currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${basePageBtn} ${isActive ? activePageBtn : inactivePageBtn}`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(pageInfo.currentPage + 1)}
        disabled={isNextDisabled}
        className={`${navBtn} ${isNextDisabled ? navBtnDisabled : navBtnEnabled}`}
      >
        次へ
      </button>
    </div>
  );
};
