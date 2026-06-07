import { useState } from "react";
import type { ImageData } from "../../types/ImageData";
import { buildProductImageUrl } from "../../utils/productImageUrl";

type Props = {
  images: ImageData[];
  productName: string;
};

export const ProductImageGallery = ({ images, productName }: Props) => {
  const mainImage = images.find((img) => img.mainImage) ?? images[0] ?? null;
  const [mainKey, setMainKey] = useState(
    buildProductImageUrl(mainImage?.s3Key),
  );

  return (
    <div className="space-y-3">
      <div className="aspect-square overflow-hidden rounded-lg bg-zinc-100">
        <img
          src={mainKey}
          alt={productName}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex gap-2">
        {images.map((img) => {
          const handleClick = () => {
            setMainKey(buildProductImageUrl(img.s3Key));
          };

          return (
            <button
              key={img.s3Key}
              onClick={handleClick}
              className={`h-16 w-16 overflow-hidden rounded border-2 transition ${
                mainKey === buildProductImageUrl(img.s3Key)
                  ? "border-zinc-800"
                  : "border-zinc-200 hover:border-zinc-400"
              }`}
            >
              <img
                src={buildProductImageUrl(img.s3Key)}
                className="h-full w-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
