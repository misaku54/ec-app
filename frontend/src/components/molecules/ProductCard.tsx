import { Link } from "react-router";
import type { Product } from "../../types/Product";
import {
  NO_IMAGE_URL,
  buildProductImageUrl,
} from "../../utils/productImageUrl";

type Props = {
  product: Product;
};

export const ProductCard = ({ product }: Props) => {
  const mainImageKey =
    product.productImageList.find((img) => img.mainImage)?.s3Key ?? null;
  const isSoldOut = product.stock === 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block overflow-hidden rounded border border-zinc-200 bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        <img
          src={buildProductImageUrl(mainImageKey)}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = NO_IMAGE_URL;
            e.currentTarget.onerror = null;
          }}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        {isSoldOut && (
          <span className="absolute left-2 top-2 rounded bg-zinc-900/80 px-2 py-0.5 text-xs font-semibold text-white">
            在庫切れ
          </span>
        )}
      </div>
      <div className="space-y-1 p-3">
        <p className="line-clamp-2 text-sm text-zinc-800">{product.name}</p>
        <p className="text-base font-semibold text-zinc-900">
          ¥{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
};
