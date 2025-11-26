import { useNavigate } from "react-router";
export const Page1DetailB = () => {
  const nagative = useNavigate();
  const onClickBack = () => {
    nagative(-1);
  }

  return (
    <div>
      <h1>Page1DetailB</h1>
      <button onClick={onClickBack}>戻る</button>
    </div>
  );
}