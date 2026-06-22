import { useEffect } from "react";
import { useDiaLogContext } from "../../context/DiaLogContext";
import { useAdmProducts } from "../../hooks/useAdmProducts";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";
import { Loader } from "../atoms/loader/Loader";
import { Paging } from "../molecules/Paging";
import { ProductTable } from "../organisms/table/ProductTable";

export const ProductManegement = () => {
  const { isLoading, products, getProducts, pageInfo } = useAdmProducts();
  const {
    isLoading: deleteLoading,
    deletedProduct,
    deleteProduct,
  } = useDeleteProduct();
  const { openDiaLog } = useDiaLogContext();

  const handleDelete = (id: number) => {
    openDiaLog("この商品を削除しますか？", () => deleteProduct(id));
  };

  const handlePageChange = (page: number) => {
    getProducts(page);
  };

  // 初回レンダリング後に商品一覧を取得
  useEffect(() => getProducts(), []);

  useEffect(() => {
    if (deletedProduct?.productId) {
      getProducts();
    }
  }, [deletedProduct]);

  return (
    <>
      <h1 className="text-2xl font-bold text-zinc-800 mb-6 pb-2 border-b border-zinc-200">
        商品一覧
      </h1>
      {isLoading || deleteLoading ? (
        <Loader />
      ) : (
        <>
          <ProductTable products={products} onDelete={handleDelete} />
          {pageInfo && (
            <Paging pageInfo={pageInfo} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </>
  );
};
