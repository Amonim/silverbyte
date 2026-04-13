import { Link } from "react-router-dom";
import { products } from "../../data/product";
import { addToCart } from "../../utils/cart";
import FavoriteButton from "../product/FavoriteButton";

function PopularProducts() {
  const popularProducts = products.filter((product) =>
    [1, 7, 14, 25].includes(product.id),
  );

  return (
    <section className="popular-products">
      <div className="container">
        <div className="popular-products__top">
          <div>
            <h2 className="popular-products__title">Популярные товары</h2>
            <p className="popular-products__subtitle">
              Самые востребованные гаджеты среди покупателей
            </p>
          </div>

          <Link to="/catalog" className="popular-products__link">
            Смотреть каталог
          </Link>
        </div>

        <div className="popular-products__grid">
          {popularProducts.map((product) => (
            <article className="catalog-card" key={product.id}>
              <FavoriteButton productId={product.id} className="catalog-card__fav-btn" />
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="catalog-card__image"
                />
              </Link>

              <Link to={`/product/${product.id}`}>
                <h3 className="catalog-card__title">{product.title}</h3>
              </Link>

              <p className="catalog-card__price">
                {product.price.toLocaleString()} ₸
              </p>

              <button
                className="catalog-card__button"
                onClick={() => addToCart(product)}
              >
                В корзину
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularProducts;
