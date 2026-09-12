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
      alt={isMain ? "メイン画像" : "サブ画像"}
      className={`h-28 w-28 rounded-md object-cover ${
        isMain ? "ring-2 ring-zinc-800" : "border border-zinc-200"
      }`}
    />
  );
};
