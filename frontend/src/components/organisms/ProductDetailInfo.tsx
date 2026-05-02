import type { ProductDetail } from "../../types/ProductDetail";
import { ProductImageList } from "../molecules/ProductImageList";

type Props = {
  selectedProduct: ProductDetail;
}

export const ProductDetailInfo:React.FC<Props> = (props) => {
  const {selectedProduct} = props;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6 pb-2 border-b border-zinc-200">商品詳細</h1>
      <div className="bg-white rounded-lg border border-zinc-200 p-6 space-y-4">
        <div className="flex items-center">
          <span className="w-32 text-sm font-medium text-zinc-400">商品ID</span>
          <span className="text-zinc-700">{selectedProduct.id}</span>
        </div>
        <div className="flex items-center">
          <span className="w-32 text-sm font-medium text-zinc-400">商品名</span>
          <span className="text-zinc-800 font-semibold">{selectedProduct.name}</span>
        </div>
        <div className="flex items-start">
          <span className="w-32 text-sm font-medium text-zinc-400">備考</span>
          <span className="text-zinc-600">{selectedProduct.description}</span>
        </div>
        <div className="flex items-center">
          <span className="w-32 text-sm font-medium text-zinc-400">価格</span>
          <span className="text-zinc-800 font-bold text-lg">¥{selectedProduct.price.toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          <span className="w-32 text-sm font-medium text-zinc-400">在庫</span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedProduct.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
            {selectedProduct.stock}
          </span>
        </div>
        <div className="flex items-center">
          <span className="w-32 text-sm font-medium text-zinc-400">登録日時</span>
          <span className="text-zinc-400 text-sm">{selectedProduct.createdAt}</span>
        </div>
        <div className="flex items-center">
          <span className="w-32 text-sm font-medium text-zinc-400">更新日時</span>
          <span className="text-zinc-400 text-sm">{selectedProduct.updatedAt}</span>
        </div>
      </div>
      <div className="mt-6">
        <ProductImageList images={selectedProduct.productImageList} />
      </div>
    </div>
  )
}