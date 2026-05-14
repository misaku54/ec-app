import { ErrorMessage } from "@hookform/error-message";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router";
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
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-zinc-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-light tracking-[0.4em] text-zinc-500 uppercase">Admin</span>
          <span className="text-2xl font-semibold tracking-wide text-white">STORE</span>
        </div>
        <h2 className="mt-8 text-center text-sm font-medium tracking-widest text-zinc-500 uppercase">
          Sign in
        </h2>
      </div>
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-zinc-900 border border-zinc-800 py-8 px-6 rounded-lg">
          <p className="mb-4 min-h-[20px] text-center text-xs text-red-400">
            {errorMessage}
          </p>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-zinc-400 tracking-wide uppercase"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  {...register("email", {
                    required: "メールアドレスは必須です",
                    maxLength: 60,
                  })}
                  type="email"
                  className="block w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
                <p className="mt-1 text-xs text-red-400 min-h-[16px]">
                  <ErrorMessage errors={errors} name="email" />
                </p>
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-zinc-400 tracking-wide uppercase"
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
                  className="block w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
                <p className="mt-1 text-xs text-red-400 min-h-[16px]">
                  <ErrorMessage errors={errors} name="password" />
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
              >
                ログイン
              </button>
            </div>
          </form>
          <p className="mt-6 text-center text-xs text-zinc-500">
            アカウントをお持ちでない方は{" "}
            <Link to="/register" className="text-zinc-300 hover:text-white underline">
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
