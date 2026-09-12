import type { ProductDetail } from "../../types/ProductDetail";
import { formatDateTime } from "../../utils/formatDate";
import { ProductImageList } from "../molecules/ProductImageList";

type Props = {
  selectedProduct: ProductDetail;
};

// ラベルは w-32 固定。shrink-0 がないと備考のような長文の行だけラベルが縮み、値の開始位置がずれる
const labelClass = "w-32 shrink-0 text-sm font-medium text-zinc-400";

export const AdmProductDetailInfo = ({ selectedProduct }: Props) => {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-zinc-800 mb-6 pb-2 border-b border-zinc-200">
        商品詳細
      </h1>
      <div className="bg-white rounded-lg border border-zinc-200 p-6 space-y-4">
        <div className="flex items-center">
          <span className={labelClass}>商品ID</span>
          <span className="text-zinc-700">{selectedProduct.id}</span>
        </div>
        <div className="flex items-center">
          <span className={labelClass}>商品名</span>
          <span className="text-zinc-800 font-semibold">
            {selectedProduct.name}
          </span>
        </div>
        <div className="flex items-start">
          <span className={labelClass}>備考</span>
          <span className="text-zinc-600">{selectedProduct.description}</span>
        </div>
        <div className="flex items-center">
          <span className={labelClass}>価格</span>
          <span className="text-zinc-800 font-bold text-lg">
            ¥{selectedProduct.price.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center">
          <span className={labelClass}>在庫</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              selectedProduct.stock > 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {selectedProduct.stock}
          </span>
        </div>
        <div className="flex items-start">
          <span className={labelClass}>商品画像</span>
          <ProductImageList images={selectedProduct.productImageList} />
        </div>
        <div className="flex items-center">
          <span className={labelClass}>登録日時</span>
          <span className="text-zinc-400 text-sm">
            {formatDateTime(selectedProduct.createdAt)}
          </span>
        </div>
        <div className="flex items-center">
          <span className={labelClass}>更新日時</span>
          <span className="text-zinc-400 text-sm">
            {formatDateTime(selectedProduct.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};
