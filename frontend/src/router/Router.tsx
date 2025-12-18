import { Route, Routes } from "react-router";
import { ProductManegement } from "../components/pages/ProductManegement";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<div className="bg-red-200">ログイン画面</div>}/>
      <Route path="/admin/product">
        <Route path="list" element={<ProductManegement />}/>
        <Route path=":id" element={<div>aaa</div>}/>
      </Route>
      <Route path="*" element={<div>404</div>}/>
    </Routes>
  );
}