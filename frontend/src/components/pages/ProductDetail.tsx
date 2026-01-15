import { useEffect } from "react";
import { useParams } from "react-router";
import { useSelectProduct } from "../../hooks/useSelectProduct";

export const ProductDetail:React.FC = () => {
  const { loading, selectedProduct ,selectProduct } = useSelectProduct();
  const { id = '0' } = useParams();
  useEffect(() => selectProduct(id), []);
  
  return (
    <>
      <div>{selectedProduct?.id}</div>
      <div>{selectedProduct?.name}</div>
      <div>{selectedProduct?.description}</div>
      <div>{selectedProduct?.price}</div>
      <div>{selectedProduct?.stock}</div>
      <div>{selectedProduct?.createdAt}</div>
      <div>{selectedProduct?.updatedAt}</div>
      <img src={selectedProduct?.imageUrl ?? null} width={200} height={200}/>
    </>
  )
}