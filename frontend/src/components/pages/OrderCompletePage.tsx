import { Link, useParams } from "react-router";

export const OrderCompletePage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="max-w-lg mx-auto text-center py-16">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-emerald-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-zinc-800 mb-2">
        ご注文ありがとうございます
      </h1>
      <p className="text-sm text-zinc-400 mb-8">
        注文番号: <span className="font-medium text-zinc-600">#{orderId}</span>
      </p>

      <div className="bg-white rounded-lg border border-zinc-200 p-6 mb-8 text-left">
        <p className="text-sm text-zinc-600">
          ご注文を受け付けました。商品の準備ができ次第、発送いたします。
        </p>
      </div>

      <Link
        to="/"
        className="inline-block bg-zinc-900 text-white px-8 py-2.5 rounded-md text-sm font-semibold hover:bg-zinc-700 transition-colors"
      >
        トップへ戻る
      </Link>
    </div>
  );
};
