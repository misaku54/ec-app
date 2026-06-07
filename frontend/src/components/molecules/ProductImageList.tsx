import type { ImageData } from '../../types/ImageData';
import { ProductImage } from "../atoms/ProductImage";

type Props = {
  images: ImageData[]
};

export const ProductImageList = (props: Props) => {
  const {images} = props;

  console.log(images);
  if (!images || images.length === 0) {
    return <div className="product_images">画像がありません</div>
  }

  return (
    <div className="product_images">
      {images.map((image) => (
        <ProductImage
          key={image.s3Key}
          s3Key={image.s3Key}
          isMain={image.mainImage}
        />
      ))}
    </div>
  )
}