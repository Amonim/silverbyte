import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";

function CartSection() {
  const {
    items,
    total,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  return (
    <section className="cart">
      <div className="container">
        <div className="cart__top">
          <div>
            <h1 className="cart__title">Корзина</h1>
            <p className="cart__subtitle">
              Добавленные товары для оформления заказа
            </p>
          </div>

          {items.length > 0 && (
            <button className="cart__clear" onClick={clearCart} type="button">
              Очистить корзину
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="cart__empty">
            <h2 className="cart__empty-title">Корзина пуста</h2>
            <p className="cart__empty-text">
              Добавьте товары из каталога, чтобы продолжить покупки.
            </p>
            <Link to="/catalog" className="cart__empty-link">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="cart__layout">
            <div className="cart__items">
              {items.map((item) => (
                <article className="cart-card" key={item.id}>
                  <Link
                    to={`/product/${item.id}`}
                    className="cart-card__image-link"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="cart-card__image"
                    />
                  </Link>

                  <div className="cart-card__content">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="cart-card__title">{item.title}</h3>
                    </Link>

                    <p className="cart-card__price">
                      {item.price.toLocaleString()} ₸
                    </p>

                    <div className="cart-card__controls">
                      <div className="cart-card__quantity">
                        <button
                          type="button"
                          className="cart-card__qty-btn"
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          −
                        </button>

                        <span className="cart-card__qty-value">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          className="cart-card__qty-btn"
                          onClick={() => increaseQuantity(item.id)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-card__remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>

                  <div className="cart-card__total">
                    {(item.price * item.quantity).toLocaleString()} ₸
                  </div>
                </article>
              ))}
            </div>

            <aside className="cart-summary">
              <h2 className="cart-summary__title">Итого</h2>

              <div className="cart-summary__row">
                <span>Товаров</span>
                <span>{items.length}</span>
              </div>

              <div className="cart-summary__row">
                <span>Количество</span>
                <span>
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>

              <div className="cart-summary__row cart-summary__row--total">
                <span>Общая сумма</span>
                <span>{total.toLocaleString()} ₸</span>
              </div>

              <Link to="/checkout" className="cart-summary__button">
                Перейти к оформлению
              </Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

export default CartSection;
