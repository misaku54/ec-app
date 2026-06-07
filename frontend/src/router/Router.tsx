import { Navigate, Route, Routes } from "react-router";
import { AdmProductDetail } from "../components/pages/AdmProductDetail";
import { CartPage } from "../components/pages/CartPage";
import { CheckOutPage } from "../components/pages/CheckOutPage";
import { Login } from "../components/pages/Login";
import { OrderCompletePage } from "../components/pages/OrderCompletePage";
import { ProductCreateForm } from "../components/pages/ProductCreateForm";
import { ProductDetailPage } from "../components/pages/ProductDetailPage";
import { ProductListPage } from "../components/pages/ProductListPage";
import { ProductManegement } from "../components/pages/ProductManegement";
import { Register } from "../components/pages/Register";
import { AdminRoute } from "../components/router/AdminRoute";
import { PrivateRoute } from "../components/router/PrivateRoute";
import { AdmDefaultLayout } from "../components/templates/AdmDefaultLayout";
import { CustomerDefaultLayout } from "../components/templates/CustomerDefaultLayout";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute />}>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdmDefaultLayout />}>
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<ProductManegement />} />
            <Route path="products/:id" element={<AdmProductDetail />} />
            <Route path="products/create" element={<ProductCreateForm />} />
          </Route>
        </Route>
        <Route element={<CustomerDefaultLayout />}>
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
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
