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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-indigo-600">
        商品登録
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow p-6 space-y-6"
      >
        <div className="flex items-start">
          <label
            htmlFor="name"
            className="w-32 text-sm font-semibold text-gray-500 pt-2 shrink-0"
          >
            商品名 <span className="text-red-500">*</span>
          </label>
          <div className="flex-1">
            <input
              id="name"
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              {...register("name", {
                required: "商品名は必須です",
                maxLength: { value: 60, message: "商品名は60文字以内で入力してください" },
              })}
            />
            <p className="text-red-500 text-xs mt-1">
              <ErrorMessage errors={errors} name="name" />
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <label
            htmlFor="price"
            className="w-32 text-sm font-semibold text-gray-500 pt-2 shrink-0"
          >
            価格(税抜き) <span className="text-red-500">*</span>
          </label>
          <div className="flex-1">
            <input
              id="price"
              type="number"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              {...register("price", {
                required: "価格は必須です",
                min: { value: 100, message: "価格は100円以上で入力してください" },
                max: { value: 1000000, message: "価格は1,000,000円以下で入力してください" },
              })}
            />
            <p className="text-red-500 text-xs mt-1">
              <ErrorMessage errors={errors} name="price" />
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <label
            htmlFor="stock"
            className="w-32 text-sm font-semibold text-gray-500 pt-2 shrink-0"
          >
            在庫数 <span className="text-red-500">*</span>
          </label>
          <div className="flex-1">
            <input
              id="stock"
              type="number"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              {...register("stock", {
                required: "在庫数は必須です",
                min: { value: 1, message: "在庫数は1以上で入力してください" },
                max: { value: 100, message: "在庫数は100以下で入力してください" },
              })}
            />
            <p className="text-red-500 text-xs mt-1">
              <ErrorMessage errors={errors} name="stock" />
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <label
            htmlFor="description"
            className="w-32 text-sm font-semibold text-gray-500 pt-2 shrink-0"
          >
            備考
          </label>
          <div className="flex-1">
            <textarea
              id="description"
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              {...register("description", {
                maxLength: { value: 3000, message: "備考は3000文字以内で入力してください" },
              })}
            />
            <p className="text-red-500 text-xs mt-1">
              <ErrorMessage errors={errors} name="description" />
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <label
            htmlFor="imageFiles"
            className="w-32 text-sm font-semibold text-gray-500 pt-2 shrink-0"
          >
            商品画像
          </label>
          <div className="flex-1">
            <input
              id="imageFiles"
              type="file"
              multiple
              accept=".png"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              {...register("imageFiles")}
            />
            <p className="text-red-500 text-xs mt-1">
              <ErrorMessage errors={errors} name="imageFiles" />
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            登録する
          </button>
        </div>
      </form>
    </div>
  );
};
