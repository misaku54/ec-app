import { Route, Routes } from "react-router";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<div className="bg-red-200">ログイン画面</div>}/>
      <Route path="api/admin/product">
        <Route path="list" element={<div>商品一覧</div>}/>
      </Route>
      <Route path="*" element={<div>404</div>}/>
    </Routes>
  );
}