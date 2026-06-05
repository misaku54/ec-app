import { useForm } from "react-hook-form";
import type { SearchForm } from "../../types/Form";

type Props = {
  defaultValues: SearchForm;
  onSearch: (searchForm: SearchForm) => void;
};

const inputClass =
  "w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none";

export const ProductSearchForm = ({ defaultValues, onSearch }: Props) => {
  const { register, handleSubmit } = useForm<SearchForm>({
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      className="rounded border border-zinc-200 bg-white p-4"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr_1fr_auto_auto] md:items-end">
        <Field label="商品名" htmlFor="name">
          <input
            id="name"
            type="text"
            placeholder="キーワード"
            className={inputClass}
            {...register("name")}
          />
        </Field>

        <Field label="最小価格" htmlFor="minPrice">
          <input
            id="minPrice"
            type="number"
            min={0}
            placeholder="0"
            className={inputClass}
            {...register("minPrice", { valueAsNumber: true })}
          />
        </Field>

        <Field label="最大価格" htmlFor="maxPrice">
          <input
            id="maxPrice"
            type="number"
            min={0}
            placeholder="上限なし"
            className={inputClass}
            {...register("maxPrice", { valueAsNumber: true })}
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input type="checkbox" {...register("inStock")} />
          在庫ありのみ
        </label>

        <button
          type="submit"
          className="h-10 rounded bg-zinc-800 px-6 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          検索
        </button>
      </div>
    </form>
  );
};

const Field = ({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <label htmlFor={htmlFor} className="block text-xs text-zinc-600">
      {label}
    </label>
    {children}
  </div>
);
