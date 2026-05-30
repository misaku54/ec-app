import { ErrorMessage } from "@hookform/error-message";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Navigate } from "react-router";
import { useCreateOrder } from "../../hooks/useCreateOrder";
import { useCartStore } from "../../stores/useCartStore";
import type { OrderCreateRequest } from "../../types/Order";
import { OrderSummary } from "../organisms/OrderSummary";

type Inputs = {
  shippingName: string;
  shippingPostalCode: string;
  shippingAddress: string;
  shippingPhone: string;
  note: string;
};

const inputClass =
  "w-full border border-zinc-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400";
const labelClass = "w-36 text-sm font-medium text-zinc-400 pt-2 shrink-0";
const errorClass = "text-red-500 text-xs mt-1 min-h-[16px]";

export const CheckOutPage = () => {
  const cart = useCartStore((state) => state.cart);
  const total = useCartStore((state) => state.getTotal());
  const { isLoading, createOrder } = useCreateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const form: OrderCreateRequest = {
      shippingName: data.shippingName,
      shippingPostalCode: data.shippingPostalCode,
      shippingAddress: data.shippingAddress,
      shippingPhone: data.shippingPhone || undefined,
      note: data.note || undefined,
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.count,
      })),
    };
    createOrder(form);
  };

  if (cart.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6 pb-2 border-b border-zinc-200">
        チェックアウト
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* 配送先フォーム */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg border border-zinc-200 p-6 space-y-5">
              <h2 className="text-sm font-semibold text-zinc-700 tracking-wide uppercase border-b border-zinc-100 pb-3">
                配送先情報
              </h2>

              <div className="flex items-start">
                <label htmlFor="shippingName" className={labelClass}>
                  氏名 <span className="text-red-400">*</span>
                </label>
                <div className="flex-1">
                  <input
                    {...register("shippingName", {
                      required: "氏名は必須です",
                      maxLength: {
                        value: 255,
                        message: "氏名は255文字以内で入力してください",
                      },
                    })}
                    id="shippingName"
                    type="text"
                    className={inputClass}
                  />
                  <p className={errorClass}>
                    <ErrorMessage errors={errors} name="shippingName" />
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <label htmlFor="shippingPostalCode" className={labelClass}>
                  郵便番号 <span className="text-red-400">*</span>
                </label>
                <div className="flex-1">
                  <input
                    {...register("shippingPostalCode", {
                      required: "郵便番号は必須です",
                      pattern: {
                        value: /^\d{3}-\d{4}$/,
                        message: "郵便番号はXXX-XXXXの形式で入力してください",
                      },
                    })}
                    id="shippingPostalCode"
                    type="text"
                    placeholder="123-4567"
                    className={inputClass}
                  />
                  <p className={errorClass}>
                    <ErrorMessage errors={errors} name="shippingPostalCode" />
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <label htmlFor="shippingAddress" className={labelClass}>
                  住所 <span className="text-red-400">*</span>
                </label>
                <div className="flex-1">
                  <input
                    {...register("shippingAddress", {
                      required: "住所は必須です",
                    })}
                    id="shippingAddress"
                    type="text"
                    className={inputClass}
                  />
                  <p className={errorClass}>
                    <ErrorMessage errors={errors} name="shippingAddress" />
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <label htmlFor="shippingPhone" className={labelClass}>
                  電話番号
                  <span className="ml-1 text-xs text-zinc-300">(任意)</span>
                </label>
                <div className="flex-1">
                  <input
                    {...register("shippingPhone", {
                      maxLength: {
                        value: 20,
                        message: "電話番号は20文字以内で入力してください",
                      },
                    })}
                    id="shippingPhone"
                    type="tel"
                    className={inputClass}
                  />
                  <p className={errorClass}>
                    <ErrorMessage errors={errors} name="shippingPhone" />
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <label htmlFor="note" className={labelClass}>
                  備考
                  <span className="ml-1 text-xs text-zinc-300">(任意)</span>
                </label>
                <div className="flex-1">
                  <textarea
                    {...register("note")}
                    id="note"
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 注文内容サイドバー */}
          <div className="md:col-span-2 space-y-4">
            <OrderSummary cart={cart} total={total ?? 0} />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-900 text-white py-3 rounded-md text-sm font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "処理中..." : "注文を確定する"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
