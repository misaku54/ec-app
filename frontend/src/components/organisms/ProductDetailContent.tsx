import type { CartItem } from "../../types/Cart";
import type { ProductDetail } from "../../types/ProductDetail";
import { AddToCartButton } from "../atoms/button/AddToCartButton";
import { ProductImageGallery } from "../molecules/ProductImageGallery";

type Props = {
  product: ProductDetail;
};

export const ProductDetailContent = ({ product }: Props) => {
  const item: CartItem = {
    productId: product.id,
    price: product.price,
    name: product.name,
    stock: product.stock,
    count: 1,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <ProductImageGallery
            images={product.productImageList}
            productName={product.name}
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-zinc-800">{product.name}</h1>
          <p className="text-xl font-semibold text-zinc-900">
            ¥{product.price.toLocaleString()}
          </p>
          <p className="text-sm leading-relaxed text-zinc-600">
            {product.description}
          </p>
          <AddToCartButton item={item} />
        </div>
      </div>
    </div>
  );
};
