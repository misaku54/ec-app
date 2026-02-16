import type { ProductDetail } from "../../types/ProductDetail";
import { ProductImageList } from "../molecules/ProductImageList";

type Props = {
  selectedProduct: ProductDetail;
}

export const ProductDetailInfo:React.FC<Props> = (props) => {
  const {selectedProduct} = props;

  return (
    <>
      <div>{selectedProduct.id}</div>
      <div>{selectedProduct.name}</div>
      <div>{selectedProduct.description}</div>
      <div>{selectedProduct.price}</div>
      <div>{selectedProduct.stock}</div>
      <div>{selectedProduct.createdAt}</div>
      <div>{selectedProduct.updatedAt}</div>
      <ProductImageList images={selectedProduct.productImageList} />
    </>
  )
}