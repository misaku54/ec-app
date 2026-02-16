type Props = {
  s3Key: string;
  isMain?: boolean;
};

export const ProductImage: React.FC<Props> = (props) => {
  const {s3Key, isMain} = props;
  // url生成
  const baseUrl = "http://localhost:9000/your-bucket";
  const imageUrl = `${baseUrl}/${s3Key}`
  const noImageUrl = `${baseUrl}/noImage.png`
  
  return (
    <img
      src={imageUrl}
      onError={(e) => {
        e.currentTarget.src = noImageUrl;
        e.currentTarget.onerror = null;
      }}
      width="200"
      height="200"
      alt={isMain? "main" : "sub"}
    />
  )
}