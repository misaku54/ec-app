import React, { useEffect } from "react";
import { useAllProduct } from "../../hooks/useAllProducts";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";
import { Loader } from "../atoms/loader/Loader";
import { ProductTable } from "../organisms/table/ProductTable";

export const ProductManegement: React.FC = () => {
  const { loading, products, getProducts } = useAllProduct();
  const {
    loading: deleteLoding,
    deletedProduct,
    deleteProduct,
  } = useDeleteProduct();

  // 初回レンダリング後に商品一覧を取得
  useEffect(() => getProducts(), []);

  useEffect(() => {
    if (deletedProduct?.productId) {
      getProducts();
    }
  }, [deletedProduct, getProducts]);

  return (
    <>
      {loading || deleteLoding ? (
        <Loader />
      ) : (
        <ProductTable products={products} onDelete={deleteProduct} />
      )}
    </>
  );
};
