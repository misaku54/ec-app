import { ErrorMessage } from "@hookform/error-message";
import { useForm, type SubmitHandler } from "react-hook-form";

type Inputs = {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageFiles: FileList; // 一旦考える
};

export const ProductCreateForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">商品名</label>
        <div>
          <input
            id="name"
            type="text"
            {...register("name", {
              required: "商品名は必須です",
              maxLength: 60,
            })}
          />
          <p>
            <ErrorMessage errors={errors} name="name" />
          </p>
        </div>
      </div>
      <div>
        <label htmlFor="price">価格(税抜き)</label>
        <div>
          <input
            id="price"
            type="number"
            {...register("price", {
              required: "価格は必須です",
              min: 100,
              max: 1000000,
            })}
          />
          <p>
            <ErrorMessage errors={errors} name="price" />
          </p>
        </div>
      </div>
      <div>
        <label htmlFor="stock">在庫数</label>
        <div>
          <input
            id="stock"
            type="number"
            {...register("stock", {
              required: "在庫数は必須です",
              min: 1,
              max: 100,
            })}
          />
          <p>
            <ErrorMessage errors={errors} name="stock" />
          </p>
        </div>
      </div>
      <div>
        <label htmlFor="description">備考</label>
        <div>
          <textarea
            id="description"
            {...register("description", {
              maxLength: 3000,
            })}
          />
          <p>
            <ErrorMessage errors={errors} name="description" />
          </p>
        </div>
      </div>
      <div>
        <label htmlFor="imageFiles">商品画像</label>
        <div>
          <input
            id="imageFiles"
            type="file"
            accept=".png"
            multiple
            {...register("imageFiles")}
          />
          <p>
            <ErrorMessage errors={errors} name="imageFiles" />
          </p>
        </div>
      </div>
      <div>
        <button type="submit">登録</button>
      </div>
    </form>
  );
};
