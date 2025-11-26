import { Link, Outlet } from "react-router";
export const Page2 = () => {
  return (
    <div>
      <h1>Page2</h1>
      <br />
      <Link to="/page2/100">UrlParameter</Link>
      <br />
      <Outlet />
    </div>
  );
}