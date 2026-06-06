import React from "react";
import { Link } from "react-router";
import type { Product } from "../../../types/Product";
import { Button } from "../../atoms/button/Button";

type Props = {
  products: Product[];
  onDelete: (id: number) => void;
};

export const ProductTable = (props: Props) => {
  const { products, onDelete } = props;

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-zinc-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">商品ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">商品名</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">備考</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">価格</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">在庫</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">登録日時</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">更新日時</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-zinc-100">
          {products.map((product, index) => (
            <tr key={product.id} className={index % 2 === 0 ? "bg-white hover:bg-zinc-50" : "bg-zinc-50 hover:bg-zinc-100"}>
              <td className="px-4 py-3 text-sm text-zinc-400">{product.id}</td>
              <td className="px-4 py-3 text-sm font-medium">
                <Link
                  to={`/admin/products/${product.id}`}
                  className="text-zinc-800 hover:text-zinc-500 hover:underline"
                >
                  {product.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500 max-w-xs truncate">{product.description}</td>
              <td className="px-4 py-3 text-sm text-zinc-800 text-right font-medium">¥{product.price.toLocaleString()}</td>
              <td className="px-4 py-3 text-sm text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                  {product.stock}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-400">{product.createdAt}</td>
              <td className="px-4 py-3 text-sm text-zinc-400">{product.updatedAt}</td>
              <td className="px-4 py-3 text-sm text-right">
                <Button onClick={() => onDelete(product.id)} className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1 rounded transition-colors">削除</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
