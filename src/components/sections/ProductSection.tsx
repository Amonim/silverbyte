import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RelatedProduct from "../product/RelatedProduct";
import { addToCart } from "../../utils/cart";
import FavoriteButton from "../product/FavoriteButton";
import { markProductViewed } from "../../utils/profile";
import { getProductById, getProducts } from "../../api/productsApi";
import type { Product } from "../../data/product";

export default function ProductSection() {
  const { id } = useParams();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      const productData = await getProductById(Number(id));
      if (productData) {
        setProduct(productData);
        const allProducts = await getProducts();
        setRelatedProducts(
          allProducts
            .filter(
              (item) => item.category === productData.category && item.id !== productData.id,
            )
            .slice(0, 3)
        );
      } else {
        setProduct(null);
      }
      setIsLoading(false);
    };
    fetchProductData();
  }, [id]);

  useEffect(() => {
    setActiveImage(0);
    if (product) {
      markProductViewed(product.id);
    }
  }, [product]);

  if (isLoading) {
    return (
      <section className="product">
        <div className="container">
          <p>Загрузка товара...</p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="product">
        <div className="container">
          <h1 className="product__not-found">Товар не найден</h1>
        </div>
      </section>
    );
  }



  return (
    <>
      <section className="product">
        <div className="container">
          <div className="product__layout">
            <div className="product__gallery">
              <div
                className="product__main"
                onClick={() => setIsPreviewOpen(true)}
              >
                <img
                  src={product.images[activeImage]}
                  alt={product.title}
                  className="product__main-image"
                />
              </div>

              <div className="product__thumbs">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={
                      activeImage === index
                        ? "product__thumb product__thumb--active"
                        : "product__thumb"
                    }
                    onClick={() => setActiveImage(index)}
                    type="button"
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            </div>

            <div className="product__info">
              <span className="product__badge">{product.specs.category}</span>

              <h1 className="product__title">{product.title}</h1>

              <p className="product__price">
                {product.price.toLocaleString()} ₸
              </p>

              <p className="product__desc">{product.description}</p>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  className="product__buy-btn"
                  style={{ flex: 1 }}
                  onClick={() => addToCart(product)}
                >
                  В корзину
                </button>
                <FavoriteButton productId={product.id} className="product__fav-btn" />
              </div>
            </div>
          </div>

          <div className="product__specs">
            <h2 className="product__specs-title">Характеристики</h2>

            <div className="product__specs-grid">
              <div className="product__spec-name">Бренд</div>
              <div className="product__spec-value">{product.specs.brand}</div>

              <div className="product__spec-name">Модель</div>
              <div className="product__spec-value">{product.specs.model}</div>

              <div className="product__spec-name">Категория</div>
              <div className="product__spec-value">
                {product.specs.category}
              </div>

              <div className="product__spec-name">Гарантия</div>
              <div className="product__spec-value">
                {product.specs.warranty}
              </div>
            </div>
          </div>

          <RelatedProduct relatedProducts={relatedProducts} />
        </div>
      </section>

      {isPreviewOpen && (
        <div
          className="product-preview"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="product-preview__content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="product-preview__close"
              onClick={() => setIsPreviewOpen(false)}
              type="button"
            >
              ×
            </button>

            <button
              className="product-preview__arrow product-preview__arrow--left"
              onClick={() =>
                setActiveImage(
                  (prev) =>
                    (prev - 1 + product.images.length) % product.images.length,
                )
              }
              type="button"
            >
              ‹
            </button>

            <img
              src={product.images[activeImage]}
              alt={product.title}
              className="product-preview__image"
            />

            <button
              className="product-preview__arrow product-preview__arrow--right"
              onClick={() =>
                setActiveImage((prev) => (prev + 1) % product.images.length)
              }
              type="button"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}
