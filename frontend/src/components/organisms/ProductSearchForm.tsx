import { useForm } from "react-hook-form";
import type { SearchForm } from "../../types/Form";

// フォームの入力と送信
type Props = {
  onSearch: (searchForm: SearchForm) => void;
};

export const ProductSearchForm = ({ onSearch }: Props) => {
  const { register, handleSubmit } = useForm<SearchForm>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  return (
    <div>
      <form onSubmit={handleSubmit(onSearch)}>
        <div>
          <div>
            <h2>検索フォーム</h2>

            <div>
              <label htmlFor="">商品名</label>
              <div>
                <input {...register("name")} id="name" type="text" />
              </div>
            </div>

            <div>
              <label htmlFor="price">価格帯</label>
              <div>
                <input
                  {...register("minPrice", { valueAsNumber: true })}
                  id="minPrice"
                  type="number"
                />
                〜
                <input
                  {...register("maxPrice", { valueAsNumber: true })}
                  id="maxPrice"
                  type="number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="inStock">在庫あり</label>
              <div>
                <input {...register("inStock")} type="checkbox" />
              </div>
            </div>
          </div>

          <div>
            <button type="submit">検索</button>
          </div>
        </div>
      </form>
    </div>
  );
};
