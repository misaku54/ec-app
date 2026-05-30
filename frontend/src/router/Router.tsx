import { Route, Routes } from "react-router";
import { CartPage } from "../components/pages/CartPage";
import { CheckOutPage } from "../components/pages/CheckOutPage";
import { Login } from "../components/pages/Login";
import { OrderCompletePage } from "../components/pages/OrderCompletePage";
import { ProductCreateForm } from "../components/pages/ProductCreateForm";
import { ProductDetail } from "../components/pages/ProductDetail";
import { ProductManegement } from "../components/pages/ProductManegement";
import { Register } from "../components/pages/Register";
import { AdminRoute } from "../components/router/AdminRoute";
import { PrivateRoute } from "../components/router/PrivateRoute";
import { DefaultLayout } from "../components/templates/DefaultLayout";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute />}>
        <Route element={<AdminRoute />}>
          <Route path="/admin/product" element={<DefaultLayout />}>
            <Route path="list" element={<ProductManegement />} />
            <Route path=":id" element={<ProductDetail />} />
            <Route path="create" element={<ProductCreateForm />} />
          </Route>
        </Route>
        <Route element={<DefaultLayout />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckOutPage />} />
          <Route
            path="/order/complete/:orderId"
            element={<OrderCompletePage />}
          />
        </Route>
      </Route>
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
};
