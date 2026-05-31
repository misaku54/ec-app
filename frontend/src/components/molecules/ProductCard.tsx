import { Link } from "react-router";

type Props = {
  id: number;
  name: string;
  price: number;
  stock: number;
  mainImageKey: string | null;
};
export const ProductCard = ({
  id,
  name,
  price,
  stock,
  mainImageKey,
}: Props) => {
  // url生成
  const baseUrl = "http://localhost:9000/your-bucket";
  const noImageUrl = `${baseUrl}/noImage.png`;
  const imageUrl = mainImageKey ? `${baseUrl}/${mainImageKey}` : noImageUrl;

  return (
    <Link to={`/products/${id}`}>
      <div>
        <img
          src={imageUrl}
          onError={(e) => {
            e.currentTarget.src = noImageUrl;
            e.currentTarget.onerror = null;
          }}
          width="200"
          height="200"
        />
        <div>
          <p>{name}</p>
          <p>¥{price}</p>
        </div>
        {stock === 0 ? (
          <div>
            <span>在庫切れ</span>
          </div>
        ) : null}
      </div>
    </Link>
  );
};
