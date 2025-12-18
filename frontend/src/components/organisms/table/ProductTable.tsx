import React from "react";
import type { Product } from "../../../types/Product";

type Props = {
  products: Product[];
}

export const ProductTable: React.FC<Props> = (props) => {
  const { products } = props;

  return (
    <table className="border-collapse border border-gray-400">
      <thead>
        <tr>
          <th className="border border-gray-300">商品ID</th>
          <th className="border border-gray-300">商品名</th>
          <th className="border border-gray-300">備考</th>
          <th className="border border-gray-300">価格</th>
          <th className="border border-gray-300">在庫</th>
          <th className="border border-gray-300">登録日時</th>
          <th className="border border-gray-300">更新日時</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr  key={product.id}>
          <td className="border border-gray-300">{product.id}</td>
          <td className="border border-gray-300">{product.name}</td>
          <td className="border border-gray-300">{product.description}</td>
          <td className="border border-gray-300">{product.price}</td>
          <td className="border border-gray-300">{product.stock}</td>
          <td className="border border-gray-300">{product.createdAt}</td>
          <td className="border border-gray-300">{product.updatedAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}