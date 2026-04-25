import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { products } from "../../data/product";
import RelatedProduct from "../product/RelatedProduct";
import { addToCart } from "../../utils/cart";
import FavoriteButton from "../product/FavoriteButton";

export default function ProductSection() {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id));

  const [activeImage, setActiveImage] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    setActiveImage(0);
  }, [id]);

  if (!product) {
    return (
      <section className="product">
        <div className="container">
          <h1 className="product__not-found">Товар не найден</h1>
        </div>
      </section>
    );
  }

  const relatedProducts = products
    .filter(
      (item) => item.category === product.category && item.id !== product.id,
    )
    .slice(0, 3);

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
