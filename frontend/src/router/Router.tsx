import { Route, Routes } from "react-router";
import { Login } from "../components/pages/Login";
import { ProductDetail } from "../components/pages/ProductDetail";
import { ProductManegement } from "../components/pages/ProductManegement";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/product">
        <Route path="list" element={<ProductManegement />} />
        <Route path=":id" element={<ProductDetail />} />
      </Route>
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
};
