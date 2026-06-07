import { useEffect } from "react";
import { useParams } from "react-router";
import { useProduct } from "../../hooks/useProduct";
import { Loader } from "../atoms/loader/Loader";
import { ProductDetailContent } from "../organisms/ProductDetailContent";

export const ProductDetailPage = () => {
  const { isLoading, product, getProduct } = useProduct();
  const { id = "0" } = useParams();

  useEffect(() => getProduct(id), [id]);

  if (isLoading) return <Loader />;
  if (!product) return null;

  return <ProductDetailContent product={product} />;
};
