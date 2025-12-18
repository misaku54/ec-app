import React, { useEffect } from "react";
import { useAllProduct } from "../../hooks/useAllProducts";
import { Loader } from "../atoms/loader/Loader";
import { ProductTable } from "../organisms/table/ProductTable";

export const ProductManegement:React.FC = () => {
  const { loading, products, getProducts } = useAllProduct();
  
  // 初回レンダリング後に商品一覧を取得
  useEffect(() => getProducts(), []);
  console.log(products);

  return (
    <>
      {loading ? (
        <Loader />
      ) : ( 
        <ProductTable products={products}/>
      )}
  </>
  )
}