import axios from "axios";
import { useCallback, useState } from "react";
import type { Product } from "../types/Product";

interface ResponseData {
  data: Product[];
}

// 商品一覧を取得するhooks
export const useAllProduct = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const getProducts = useCallback(() => {
    setLoading(true);

    axios.get<ResponseData>("http://localhost:8888/api/admin/product/list")
      .then((res) => setProducts(res.data.data))
      .catch(() => alert("商品一覧の抽出に失敗しました。"))
      .finally(() => setLoading(false));
  },[]);

  return { loading, products, getProducts };
};