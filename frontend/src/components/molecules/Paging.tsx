import type { PageInfo } from "../../types/PageInfo";
import { Button } from "../atoms/button/Button";

type Props = {
  pageInfo: PageInfo;
  onPageChange: (page: number) => void;
};
export const Paging = ({ pageInfo, onPageChange }: Props) => {
  const isPrevDisabled = pageInfo.currentPage <= 1;
  const isNextDisabled = pageInfo.currentPage >= pageInfo.totalPage;
  return (
    <>
      <div>
        <Button
          onClick={() => onPageChange(pageInfo.currentPage - 1)}
          disabled={isPrevDisabled}
        >
          前
        </Button>
        <Button
          onClick={() => onPageChange(pageInfo.currentPage + 1)}
          disabled={isNextDisabled}
        >
          次
        </Button>
      </div>
    </>
  );
};
