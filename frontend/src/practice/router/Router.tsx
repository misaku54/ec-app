import { Routes, Route,Outlet } from "react-router";
import { Home } from "../Home";
import { Page1 } from "../Page1";
import { Page2 } from "../Page2";
import { Page1DetailB } from "../Page1DetailB";
import { Page1DetailA } from "../Page1DetailA";
import { UrlParameter } from "../UrlParameter";
import { Page404 } from "../Page404";


export const Router = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/page1">
          <Route index element={<Page1 />} />
          <Route path="detailA" element={<Page1DetailA />} />
          <Route path="detailB" element={<Page1DetailB />} />
        </Route>
        <Route path="/page2" element={<Page2 />} >
          <Route path=":id" element={<UrlParameter />}/>
        </Route>
        <Route path="*" element={<Page404 />}/>
      </Routes>
  );
}