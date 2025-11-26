import React, { useEffect, useState } from 'react';
import type { Product } from '../types/product';
import { productService } from '../services/productService';
import './ProductList.css';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProducts = await productService.getProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : '商品の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="product-list-container">
        <div className="loading">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-container">
        <div className="error">
          <h2>エラーが発生しました</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-list-container">
        <div className="empty-state">
          <h2>商品が見つかりません</h2>
          <p>現在表示できる商品がありません。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">商品一覧</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.png';
                  }}
                />
              ) : (
                <div className="no-image">No Image</div>
              )}
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">¥{product.price.toLocaleString()}</p>
              {product.description && (
                <p className="product-description">{product.description}</p>
              )}
              {product.category && (
                <span className="product-category">{product.category}</span>
              )}
              {product.stock !== undefined && (
                <div className="product-stock">
                  在庫: {product.stock > 0 ? `${product.stock}個` : '在庫切れ'}
                </div>
              )}
            </div>
            <div className="product-actions">
              <button 
                className="add-to-cart-button"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? '在庫切れ' : 'カートに追加'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;