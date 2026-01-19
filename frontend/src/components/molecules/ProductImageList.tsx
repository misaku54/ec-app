import { ProductImage } from "../atoms/ProductImage";

type ImageData = {
  s3Key: string;
  sortOrder: number;
  mainImage: boolean;
};

type Props = {
  images: ImageData[]
};

export const ProductImageList: React.FC<Props> = (props) => {
  const {images} = props;

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