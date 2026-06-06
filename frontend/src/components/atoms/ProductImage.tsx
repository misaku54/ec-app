import {
  NO_IMAGE_URL,
  buildProductImageUrl,
} from "../../utils/productImageUrl";

type Props = {
  s3Key: string;
  isMain?: boolean;
};

export const ProductImage = ({ s3Key, isMain }: Props) => {
  return (
    <img
      src={buildProductImageUrl(s3Key)}
      onError={(e) => {
        e.currentTarget.src = NO_IMAGE_URL;
        e.currentTarget.onerror = null;
      }}
      width="200"
      height="200"
      alt={isMain ? "main" : "sub"}
    />
  );
};
