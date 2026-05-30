import { ErrorMessage } from "@hookform/error-message";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
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

export const CheckOutPage = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const items = cart.map((item) => ({
      productId: item.productId,
      quantity: item.count,
    }));

    const form: OrderCreateRequest = {
      shippingName: data.shippingName,
      shippingPostalCode: data.shippingPostalCode,
      shippingAddress: data.shippingAddress,
      shippingPhone: data.shippingPhone || undefined,
      note: data.note || undefined,
      items,
    };

    createOrder(form);
  };

  return (
    <div>
      <h1>チェックアウト</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h2>配送先情報</h2>
          <div>
            <label htmlFor="shippingName">氏名</label>
            <input
              {...register("shippingName", {
                required: "氏名は必須です",
                maxLength: { value: 255, message: "氏名は255文字以内で入力してください" },
              })}
              id="shippingName"
              type="text"
            />
            <p>
              <ErrorMessage errors={errors} name="shippingName" />
            </p>
          </div>
          <div>
            <label htmlFor="shippingPostalCode">郵便番号</label>
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
            />
            <p>
              <ErrorMessage errors={errors} name="shippingPostalCode" />
            </p>
          </div>
          <div>
            <label htmlFor="shippingAddress">住所</label>
            <input
              {...register("shippingAddress", {
                required: "住所は必須です",
              })}
              id="shippingAddress"
              type="text"
            />
            <p>
              <ErrorMessage errors={errors} name="shippingAddress" />
            </p>
          </div>
          <div>
            <label htmlFor="shippingPhone">電話番号（任意）</label>
            <input
              {...register("shippingPhone", {
                maxLength: { value: 20, message: "電話番号は20文字以内で入力してください" },
              })}
              id="shippingPhone"
              type="tel"
            />
            <p>
              <ErrorMessage errors={errors} name="shippingPhone" />
            </p>
          </div>
          <div>
            <label htmlFor="note">備考（任意）</label>
            <textarea {...register("note")} id="note" />
          </div>
        </div>

        <OrderSummary cart={cart} total={total ?? 0} />

        <button type="submit" disabled={isLoading}>
          注文を確定する
        </button>
      </form>
    </div>
  );
};
