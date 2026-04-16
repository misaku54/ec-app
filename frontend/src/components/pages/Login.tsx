import { ErrorMessage } from "@hookform/error-message";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useLogin } from "../../hooks/useLogin";

type Inputs = {
  email: string;
  password: string;
};

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onSubmit", // 初回バリデーション：submit時のみ
    reValidateMode: "onSubmit", // 再バリデーション：submit時のみ（←これが重要）
  });

  const { isLoading, errorMessage, login } = useLogin();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    login(data);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          管理画面ログイン
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <p className="mb-4 min-h-[20px] text-center text-sm text-red-600">
            {errorMessage}
          </p>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                {...register("email", {
                  required: "メールアドレスは必須です",
                  maxLength: 60,
                })}
                type="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <p className="mt-1 text-sm text-red-600 min-h-[20px]">
                <ErrorMessage errors={errors} name="email" />
              </p>
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                {...register("password", {
                  required: "パスワードは必須です",
                  minLength: {
                    value: 8,
                    message: "パスワードは8文字以上でなくてはなりません",
                  },
                })}
                type="password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              <p className="mt-1 text-sm text-red-600 min-h-[20px]">
                <ErrorMessage errors={errors} name="password" />
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};
