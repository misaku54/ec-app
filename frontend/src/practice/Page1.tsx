import { Link, Outlet, useNavigate } from "react-router";
export const Page1 = () => {
  const arr = [...Array(100).keys()];
  const nagative = useNavigate();

  const onClickDetailB = () => {
    nagative("detailB");
  }

  return (
    <div>
      <h1>Page1</h1>
      <Link to="detailA" state={arr}>DetailA</Link>
      <br />
      <Link to="detailB">DetailB</Link>
      <br />
      <button onClick={onClickDetailB}>detailB</button>
       <Outlet />
    </div>
  );
}