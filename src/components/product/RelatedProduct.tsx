import { Link } from "react-router-dom";
import type { Product } from "../../data/product";
import { addToCart } from "../../utils/cart";
import FavoriteButton from "./FavoriteButton";

type RelatedProductProps = {
  relatedProducts: Product[];
};

function RelatedProduct({ relatedProducts }: RelatedProductProps) {
  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="product__related">
      <h2 className="product__related-title">Похожие товары</h2>

      <div className="product__related-grid">
        {relatedProducts.map((item) => (
          <article className="catalog-card" key={item.id}>
            <FavoriteButton productId={item.id} className="catalog-card__fav-btn" />
            <Link to={`/product/${item.id}`}>
              <img
                src={item.images[0]}
                alt={item.title}
                className="catalog-card__image"
              />
            </Link>

            <Link to={`/product/${item.id}`}>
              <h3 className="catalog-card__title">{item.title}</h3>
            </Link>

            <p className="catalog-card__price">
              {item.price.toLocaleString()} ₸
            </p>

            <button
              className="catalog-card__button"
              type="button"
              onClick={() => addToCart(item)}
            >
              В корзину
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RelatedProduct;
