import type { ImageData } from "../../types/ImageData";
import { ProductImage } from "../atoms/ProductImage";

type Props = {
  images: ImageData[];
};

export const ProductImageList = ({ images }: Props) => {
  if (!images || images.length === 0) {
    return <p className="text-sm text-zinc-400">画像がありません</p>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {images.map((image) => (
        <ProductImage
          key={image.s3Key}
          s3Key={image.s3Key}
          isMain={image.mainImage}
        />
      ))}
    </div>
  );
};
