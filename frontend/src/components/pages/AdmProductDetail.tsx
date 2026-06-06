import { useEffect } from "react";
import { useParams } from "react-router";
import { useAdmProduct } from "../../hooks/useAdmProduct";
import { AdmProductDetailInfo } from "../organisms/AdmProductDetailInfo";

export const AdmProductDetail: React.FC = () => {
  const { isLoading, selectedProduct, selectProduct } = useAdmProduct();
  const { id = "0" } = useParams();
  useEffect(() => selectProduct(id), []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-indigo-600">読み込み中...</div>;
  }

  if (!selectedProduct) {
    return <div className="flex justify-center items-center h-64 text-gray-500">商品が見つかりません</div>;
  }

  return <AdmProductDetailInfo selectedProduct={selectedProduct} />;
};
