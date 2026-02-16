import { useEffect } from "react";
import { useParams } from "react-router";
import { useSelectProduct } from "../../hooks/useSelectProduct";
import { ProductDetailInfo } from "../organisms/ProductDetailInfo";

export const ProductDetail:React.FC = () => {
  const { loading, selectedProduct ,selectProduct } = useSelectProduct();
  const { id = '0' } = useParams();
  useEffect(() => selectProduct(id), []);
  
  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (!selectedProduct) {
    return <div>商品が見つかりません</div>;
  }

  return <ProductDetailInfo selectedProduct={selectedProduct} />
}