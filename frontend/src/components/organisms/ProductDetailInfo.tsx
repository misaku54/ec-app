import type { ProductDetail } from "../../types/ProductDetail";
import { ProductImageList } from "../molecules/ProductImageList";

type Props = {
  selectedProduct: ProductDetail;
}

export const ProductDetailInfo:React.FC<Props> = (props) => {
  const {selectedProduct} = props;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-indigo-600">商品詳細</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center">
          <span className="w-32 text-sm font-semibold text-gray-500">商品ID</span>
          <span className="text-gray-800">{selectedProduct.id}</span>
        </div>
        <div className="flex items-center">
          <span className="w-32 text-sm font-semibold text-gray-500">商品名</span>
          <span className="text-gray-800 font-medium">{selectedProduct.name}</span>
        </div>
        <div className="flex items-start">
          <span className="w-32 text-sm font-semibold text-gray-500">備考</span>
          <span className="text-gray-700">{selectedProduct.description}</span>
        </div>
        <div className="flex items-center">
          <span className="w-32 text-sm font-semibold text-gray-500">価格</span>
          <span className="text-indigo-600 font-bold text-lg">¥{selectedProduct.price.toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          <span className="w-32 text-sm font-semibold text-gray-500">在庫</span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedProduct.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {selectedProduct.stock}
          </span>
        </div>
        <div className="flex items-center">
          <span className="w-32 text-sm font-semibold text-gray-500">登録日時</span>
          <span className="text-gray-500 text-sm">{selectedProduct.createdAt}</span>
        </div>
        <div className="flex items-center">
          <span className="w-32 text-sm font-semibold text-gray-500">更新日時</span>
          <span className="text-gray-500 text-sm">{selectedProduct.updatedAt}</span>
        </div>
      </div>
      <div className="mt-6">
        <ProductImageList images={selectedProduct.productImageList} />
      </div>
    </div>
  )
}