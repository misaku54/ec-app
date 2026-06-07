import { useMemo } from "react";
import { useSearchParams } from "react-router";
import type { SearchForm } from "../types/Form";

/**
 * 商品一覧の検索条件・ページ番号を URL (?page=, ?name= ...) と同期するhook。
 *
 * - 状態の単一の源は URLSearchParams のみ。
 * - ページ遷移・リロード・ブラウザバックで検索条件が維持される。
 * - 検索実行時は page=1 にリセット、ページ変更時は検索条件を引き継ぐ。
 */
export const useProductSearchParams = () => {
  // リクエストパラメータ取得
  const [searchParams, setSearchParams] = useSearchParams();

  // リクエストパラメータからページのパラメータを取得
  const page = Number(searchParams.get("page") ?? 1);

  const searchForm: SearchForm = useMemo(
    () => ({
      name: searchParams.get("name"),
      minPrice: parseNumberOrNull(searchParams.get("minPrice")),
      maxPrice: parseNumberOrNull(searchParams.get("maxPrice")),
      inStock: searchParams.get("inStock") === "true",
    }),
    // URLSearchParams の参照は不安定なため文字列をキーにする
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.toString()],
  );

  const setSearch = (form: SearchForm) => {
    const next: Record<string, string> = { page: "1" };
    if (form.name) next.name = form.name;
    if (form.minPrice != null) next.minPrice = String(form.minPrice);
    if (form.maxPrice != null) next.maxPrice = String(form.maxPrice);
    if (form.inStock) next.inStock = "true";
    setSearchParams(next);
  };

  const setPage = (nextPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(nextPage));
      return prev;
    });
  };

  return { page, searchForm, setSearch, setPage };
};

const parseNumberOrNull = (value: string | null): number | null => {
  if (value == null || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};
