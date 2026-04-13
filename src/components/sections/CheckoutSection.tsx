import { useState } from "react";
import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";
import { saveOrder, createOrderNumber } from "../../utils/orders";
import type { OrderCustomerInfo } from "../../types/order";

function CheckoutSection() {
  const { items, total, clearCart } = useCart();
  const [successOrder, setSuccessOrder] = useState<string | null>(null);

  const [formData, setFormData] = useState<OrderCustomerInfo>({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    comment: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) return;

    const newOrderNumber = createOrderNumber();
    const newOrder = {
      id: crypto.randomUUID(),
      orderNumber: newOrderNumber,
      date: new Date().toISOString(),
      items: [...items],
      total,
      customerInfo: formData,
      paymentMethod: "Оплата при получении",
      status: "pending" as const,
    };

    saveOrder(newOrder);
    clearCart();
    setSuccessOrder(newOrderNumber);
  };

  if (successOrder) {
    return (
      <section className="checkout">
        <div className="container checkout__container">
          <div className="checkout__success">
            <h2 className="checkout__success-title">Заказ оформлен</h2>
            <p className="checkout__success-text">
              Ваш номер заказа: <strong>{successOrder}</strong>. Мы свяжемся с
              вами в ближайшее время для подтверждения деталей.
            </p>
            <div className="checkout__success-actions">
              <Link to="/profile" className="checkout__button">
                Перейти в профиль
              </Link>
              <Link to="/catalog" className="checkout__button checkout__button--outline">
                Вернуться в каталог
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="checkout">
        <div className="container checkout__container">
          <div className="checkout__empty">
            <h2 className="checkout__empty-title">Корзина пуста</h2>
            <p className="checkout__empty-text">
              Вы не можете оформить заказ, так как ваша корзина пуста.
            </p>
            <Link to="/catalog" className="checkout__button">
              Перейти в каталог
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout">
      <div className="container checkout__container">
        <div className="checkout__top">
          <h1 className="checkout__title">Оформление заказа</h1>
        </div>

        <div className="checkout__layout">
          <div className="checkout__form-box">
            <form className="checkout__form" onSubmit={handleSubmit}>
              <h2 className="checkout__form-title">
                Данные получателя
              </h2>

              <input
                type="text"
                name="fullName"
                placeholder="ФИО *"
                className="checkout__input"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Телефон *"
                className="checkout__input"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="city"
                placeholder="Город *"
                className="checkout__input"
                value={formData.city}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="address"
                placeholder="Адрес доставки *"
                className="checkout__input"
                value={formData.address}
                onChange={handleChange}
                required
              />

              <textarea
                name="comment"
                placeholder="Комментарий (необязательно)"
                className="checkout__input checkout__input--textarea"
                value={formData.comment}
                onChange={handleChange}
                rows={3}
              />

              <div className="checkout__payment-info">
                <strong>Способ оплаты:</strong> Оплата при получении
              </div>

              <button className="checkout__button" type="submit">
                Подтвердить заказ
              </button>
            </form>
          </div>

          <aside className="checkout__summary">
            <h2 className="checkout__summary-title">Ваш заказ</h2>
            <div className="checkout__items">
              {items.map((item) => (
                <div key={item.id} className="checkout__item">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="checkout__item-image"
                  />
                  <div className="checkout__item-info">
                    <div className="checkout__item-title">
                      {item.title}
                    </div>
                    <div className="checkout__item-price">
                      {item.quantity} шт. × {item.price.toLocaleString()} ₸
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout__summary-row checkout__summary-row--total">
              <span>Итого</span>
              <span>{total.toLocaleString()} ₸</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default CheckoutSection;