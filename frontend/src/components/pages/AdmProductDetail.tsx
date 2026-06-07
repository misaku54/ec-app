import { useEffect } from "react";
import { useParams } from "react-router";
import { useAdmProduct } from "../../hooks/useAdmProduct";
import { Loader } from "../atoms/loader/Loader";
import { AdmProductDetailInfo } from "../organisms/AdmProductDetailInfo";

export const AdmProductDetail = () => {
  const { isLoading, selectedProduct, selectProduct } = useAdmProduct();
  const { id = "0" } = useParams();

  useEffect(() => selectProduct(id), [id]);

  if (isLoading) return <Loader />;
  if (!selectedProduct) {
    return <div className="flex justify-center items-center h-64 text-gray-500">商品が見つかりません</div>;
  }

  return <AdmProductDetailInfo selectedProduct={selectedProduct} />;
};
