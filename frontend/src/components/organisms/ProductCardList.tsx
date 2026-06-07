import type { Product } from "../../types/Product";
import { ProductCard } from "../molecules/ProductCard";

type Props = {
  products: Product[];
};

export const ProductCardList = ({ products }: Props) => {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
};
