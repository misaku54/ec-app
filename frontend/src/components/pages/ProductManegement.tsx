import React, { useEffect } from "react";
import { useAllProduct } from "../../hooks/useAllProducts";

export const ProductManegement:React.FC = () => {
  const { loading, products, getProducts } = useAllProduct();
  
  // 初回レンダリング後に商品一覧を取得
  useEffect(() => getProducts(), []);
  console.log(products);

  return (
    <div>商品一覧</div>
  )
}