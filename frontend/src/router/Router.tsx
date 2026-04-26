import { Route, Routes } from "react-router";
import { Login } from "../components/pages/Login";
import { ProductCreateForm } from "../components/pages/ProductCreateForm";
import { ProductDetail } from "../components/pages/ProductDetail";
import { ProductManegement } from "../components/pages/ProductManegement";
import { PrivateRoute } from "../components/router/PrivateRoute";
import { DefaultLayout } from "../components/templates/DefaultLayout";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/test" element={<ProductCreateForm />} />
      <Route element={<PrivateRoute />}>
        <Route path="/admin/product" element={<DefaultLayout />}>
          <Route path="list" element={<ProductManegement />} />
          <Route path=":id" element={<ProductDetail />} />
        </Route>
      </Route>
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
};
