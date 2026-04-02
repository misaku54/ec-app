import { Button } from "../atoms/button/Button";

export const Header: React.FC = () => {
  return (
    <header>
      <div>ロゴ</div>
      <Button>ログアウト</Button>
    </header>
  );
};
