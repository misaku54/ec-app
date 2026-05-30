import { Link, useParams } from "react-router";

export const OrderCompletePage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div>
      <h1>ご注文ありがとうございます</h1>
      <p>注文番号: {orderId}</p>
      <Link to="/">トップへ戻る</Link>
    </div>
  );
};
