import { Link } from "react-router-dom";
import FavoriteButton from "../product/FavoriteButton";
import useFavorites from "../../hooks/useFavorites";
import { products } from "../../data/product";
import { addToCart } from "../../utils/cart";

function FavoritesSection() {
  const { favorites } = useFavorites();

  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id)
  );

  return (
    <section className="favorites catalog">
      <div className="container">
        <h1 className="catalog__title">Избранное</h1>

        <div className="catalog__content">
          {favoriteProducts.length === 0 ? (
            <div className="catalog__empty">
              <h2 className="catalog__empty-title">Список пуст</h2>
              <p className="catalog__empty-text">
                Вы пока ничего не добавили в избранное.
              </p>
              <Link to="/catalog" className="cart__empty-link">
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <div className="catalog__grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {favoriteProducts.map((product) => (
                <article className="catalog-card" key={product.id}>
                  <FavoriteButton productId={product.id} className="catalog-card__fav-btn" />

                  <Link
                    to={`/product/${product.id}`}
                    className="catalog-card__image-link"
                  >
                    <div className="catalog-card__image-wrapper">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="catalog-card__image"
                      />
                    </div>
                  </Link>

                  <Link to={`/product/${product.id}`}>
                    <h3 className="catalog-card__title">{product.title}</h3>
                  </Link>

                  <p className="catalog-card__price">
                    {product.price.toLocaleString()} ₸
                  </p>

                  <button
                    className="catalog-card__button"
                    type="button"
                    onClick={() => addToCart(product)}
                  >
                    В корзину
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default FavoritesSection;
