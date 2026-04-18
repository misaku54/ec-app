import React from "react";
import { Link } from "react-router";
import type { Product } from "../../../types/Product";
import { Button } from "../../atoms/button/Button";

type Props = {
  products: Product[];
  onDelete: (id: number) => void;
};

export const ProductTable: React.FC<Props> = (props) => {
  const { products, onDelete } = props;

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-indigo-600">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">商品ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">商品名</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">備考</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">価格</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">在庫</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">登録日時</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">更新日時</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {products.map((product, index) => (
            <tr key={product.id} className={index % 2 === 0 ? "bg-white hover:bg-indigo-50" : "bg-gray-50 hover:bg-indigo-50"}>
              <td className="px-4 py-3 text-sm text-gray-500">{product.id}</td>
              <td className="px-4 py-3 text-sm font-medium">
                <Link
                  to={`/admin/product/${product.id}`}
                  className="text-indigo-600 hover:text-indigo-900 hover:underline"
                >
                  {product.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{product.description}</td>
              <td className="px-4 py-3 text-sm text-gray-800 text-right font-medium">¥{product.price.toLocaleString()}</td>
              <td className="px-4 py-3 text-sm text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {product.stock}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{product.createdAt}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{product.updatedAt}</td>
              <td className="px-4 py-3 text-sm text-right">
                <Button onClick={() => onDelete(product.id)}>削除</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
