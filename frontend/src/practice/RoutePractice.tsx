import { BrowserRouter, Link } from "react-router";
import { Router } from "./router/Router";

export const RoutePractice = () => {
  return (
    <BrowserRouter>
      <div>
        <Link to="/">HOME</Link>
        <br />
        <Link to="/page1">Page1</Link>
        <br />
        <Link to="/page2">Page2</Link>
      </div>
      <Router />
    </BrowserRouter>
  );
}