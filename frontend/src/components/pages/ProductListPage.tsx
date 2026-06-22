import { useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";
import { useProductSearchParams } from "../../hooks/useProductSearchParams";
import { Loader } from "../atoms/loader/Loader";
import { Paging } from "../molecules/Paging";
import { ProductCardList } from "../organisms/ProductCardList";
import { ProductSearchForm } from "../organisms/ProductSearchForm";

export const ProductListPage = () => {
  const { page, searchForm, setSearch, setPage } = useProductSearchParams();
  const { isLoading, products, pageInfo, getProducts } = useProducts();

  useEffect(() => {
    getProducts(page, searchForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchForm]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <ProductSearchForm defaultValues={searchForm} onSearch={setSearch} />

      {isLoading ? (
        <Loader />
      ) : products.length === 0 ? (
        <p className="py-12 text-center text-zinc-500">
          該当する商品はありません
        </p>
      ) : (
        <ProductCardList products={products} />
      )}

      {pageInfo && <Paging pageInfo={pageInfo} onPageChange={setPage} />}
    </div>
  );
};
