import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import useProfile from "../../hooks/useProfile";
import { createOrderNumber } from "../../utils/orders";
import { createOrder, getUserXP } from "../../utils/ordersApi";
import { calculateProfileStats } from "../../utils/profile";
import type { OrderCustomerInfo } from "../../types/order";
import type { ProfileStats } from "../../types/profile";
import { useEffect } from "react";

function CheckoutSection() {
  const { items, total, clearCart } = useCart();
  const { user, authenticated } = useAuth();
  const { stats } = useProfile();
  const navigate = useNavigate();
  const [successOrder, setSuccessOrder] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [backendStats, setBackendStats] = useState<ProfileStats | null>(null);

  useEffect(() => {
    if (user?.email) {
      getUserXP(user.email).then(xp => {
        const stats = calculateProfileStats([], xp);
        setBackendStats(stats);
      });
    }
  }, [user]);

  const discountPercent = backendStats?.discount || 0;
  const discountAmount = Math.round((total * discountPercent) / 100);
  const finalTotal = total - discountAmount;


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

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0 || !user) return;

    const newErrors: { [key: string]: string } = {};

    const fullNameTrimmed = formData.fullName.trim();
    if (!fullNameTrimmed) {
      newErrors.fullName = "Поле обязательно для заполнения";
    } else if (fullNameTrimmed.length < 4 || fullNameTrimmed.split(/\s+/).length < 2) {
      newErrors.fullName = "Минимум 2 слова (имя и фамилия), не менее 4 символов";
    }

    const phoneTrimmed = formData.phone.trim();
    if (!phoneTrimmed) {
      newErrors.phone = "Поле обязательно для заполнения";
    } else if (!/^\+\d{10,}$/.test(phoneTrimmed)) {
      newErrors.phone = "Только цифры, должен начинаться с +, минимум 10 цифр";
    }

    const cityTrimmed = formData.city.trim();
    if (!cityTrimmed) {
      newErrors.city = "Поле обязательно для заполнения";
    } else if (cityTrimmed.length < 2) {
      newErrors.city = "Минимум 2 символа";
    }

    const addressTrimmed = formData.address.trim();
    if (!addressTrimmed) {
      newErrors.address = "Поле обязательно для заполнения";
    } else if (addressTrimmed.length < 5) {
      newErrors.address = "Минимум 5 символов";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newOrderNumber = createOrderNumber();
    const newOrder = {
      id: crypto.randomUUID(),
      orderNumber: newOrderNumber,
      date: new Date().toISOString(),
      items: [...items],
      subtotal: total,
      discountPercent,
      discountAmount,
      total: finalTotal,
      customerInfo: formData,
      paymentMethod: "Оплата при получении",
      status: "pending" as const,
      userPrefix: backendStats?.prefix || "Новичок",
    };

    const finalOrder = { ...newOrder, userEmail: user.email };

    try {
      await createOrder(finalOrder);
      clearCart();
      navigate("/profile");
    } catch (err) {
      console.error(err);
      clearCart();
      navigate("/profile");
    }
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

  if (!authenticated) {
    return (
      <section className="checkout">
        <div className="container checkout__container">
          <div className="checkout__empty">
            <h2 className="checkout__empty-title">Требуется авторизация</h2>
            <p className="checkout__empty-text">
              Чтобы оформить заказ, войдите в аккаунт
            </p>
            <div className="checkout__success-actions">
              <Link to="/login" className="checkout__button">
                Войти
              </Link>
              <Link to="/register" className="checkout__button checkout__button--outline">
                Регистрация
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
              {errors.fullName && <div style={{ color: "red", fontSize: "14px", marginTop: "-10px", marginBottom: "15px" }}>{errors.fullName}</div>}

              <input
                type="tel"
                name="phone"
                placeholder="Телефон *"
                className="checkout__input"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && <div style={{ color: "red", fontSize: "14px", marginTop: "-10px", marginBottom: "15px" }}>{errors.phone}</div>}

              <input
                type="text"
                name="city"
                placeholder="Город *"
                className="checkout__input"
                value={formData.city}
                onChange={handleChange}
                required
              />
              {errors.city && <div style={{ color: "red", fontSize: "14px", marginTop: "-10px", marginBottom: "15px" }}>{errors.city}</div>}

              <input
                type="text"
                name="address"
                placeholder="Адрес доставки *"
                className="checkout__input"
                value={formData.address}
                onChange={handleChange}
                required
              />
              {errors.address && <div style={{ color: "red", fontSize: "14px", marginTop: "-10px", marginBottom: "15px" }}>{errors.address}</div>}

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

            <div className="checkout__summary-row">
              <span>Сумма</span>
              <span>{total.toLocaleString()} ₸</span>
            </div>

            {discountAmount > 0 && (
              <div className="checkout__summary-row" style={{ color: 'var(--primary)' }}>
                <span>Скидка {discountPercent}% ({backendStats?.prefix})</span>
                <span>-{discountAmount.toLocaleString()} ₸</span>
              </div>
            )}

            <div className="checkout__summary-row checkout__summary-row--total">
              <span>Итого</span>
              <span>{finalTotal.toLocaleString()} ₸</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default CheckoutSection;