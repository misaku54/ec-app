import { useEffect } from "react";
import { useParams } from "react-router";
import { useSelectProduct } from "../../hooks/useSelectProduct";
import { ProductDetailInfo } from "../organisms/ProductDetailInfo";

export const ProductDetail: React.FC = () => {
  const { isLoading, selectedProduct, selectProduct } = useSelectProduct();
  const { id = "0" } = useParams();
  useEffect(() => selectProduct(id), []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-indigo-600">読み込み中...</div>;
  }

  if (!selectedProduct) {
    return <div className="flex justify-center items-center h-64 text-gray-500">商品が見つかりません</div>;
  }

  return <ProductDetailInfo selectedProduct={selectedProduct} />;
};
