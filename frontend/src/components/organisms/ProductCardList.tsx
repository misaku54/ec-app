import type { Product } from "../../types/Product";
import { ProductCard } from "../molecules/ProductCard";

type Props = {
  products: Product[];
};
export const ProductCardList = ({ products }: Props) => {
  return (
    <div>
      {products.map((product) => {
        return (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            stock={product.stock}
            mainImageKey={
              product.productImageList.find((img) => img.mainImage)?.s3Key ??
              null
            }
          />
        );
      })}
    </div>
  );
};
