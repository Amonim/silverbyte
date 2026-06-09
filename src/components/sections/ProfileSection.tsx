import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useProfile from "../../hooks/useProfile";
import { cancelOrder } from "../../api/ordersApi";

const statusMap: Record<string, string> = {
  pending: "В обработке",
  confirmed: "Подтверждён",
  shipped: "Передан курьеру",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

function ProfileSection() {
  const { user, authenticated, logoutUser } = useAuth();
  const { orders, stats, refreshProfile } = useProfile();

  const handleCancelClick = async (orderId: string) => {
    if (user) {
      await cancelOrder(orderId, user.email);
      refreshProfile();
    }
  };

  if (!authenticated || !user) {
    return (
      <section className="profile">
        <div className="container profile__container">
          <div className="profile__empty">
            <h2 className="profile__empty-title">Требуется авторизация</h2>
            <p className="profile__empty-text">
              Чтобы открыть профиль, войдите в аккаунт
            </p>
            <div className="profile__actions">
              <Link to="/login" className="profile__button">
                Войти
              </Link>
              <Link to="/register" className="profile__button profile__button--outline">
                Регистрация
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="profile">
      <div className="container profile__container">
        <h1 className="profile__title">Личный кабинет</h1>

        <div className="profile__grid">
          <div className="profile__left">
            <div className="profile__card profile__user-info">
              <div className="profile__avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="profile__details">
                {stats && (
                  <div style={{ marginBottom: '4px' }}>
                    <span className={`profile__prefix profile__prefix--level-${stats.level}`}>
                      {stats.prefix}
                    </span>
                  </div>
                )}
                <h2 className="profile__name">{user.name}</h2>
                <p className="profile__email">{user.email}</p>
              </div>
              <button className="profile__logout" onClick={logoutUser}>
                Выйти
              </button>
            </div>

            {stats && (
              <div className="profile__card profile__stats">
                <h3 className="profile__card-title">Геймификация</h3>
                
                <div className="profile__level-info">
                  <div className="profile__level">Уровень {stats.level}</div>
                  <div className="profile__points">{stats.points} баллов</div>
                </div>

                <div className="profile__progress-bar">
                  <div 
                    className="profile__progress-fill" 
                    style={{ width: `${stats.progressToNext}%` }}
                  ></div>
                </div>
                {stats.level < 5 ? (
                  <div className="profile__progress-text">
                    До {stats.level + 1} уровня: {stats.nextLevelPoints - stats.points} баллов
                  </div>
                ) : (
                  <div className="profile__progress-text">
                    Максимальный уровень
                  </div>
                )}

                <div className="profile__achievements">
                  {stats.achievements.map((ach) => (
                    <div key={ach.id} className={`profile__achievement ${ach.completed ? 'profile__achievement--completed' : ''}`}>
                      <div className="profile__ach-header">
                        <span className="profile__ach-title">
                          {ach.title}
                          {ach.reward > 0 && (
                            <span style={{fontSize: '12px', color: 'var(--primary)', marginLeft: '8px', fontWeight: 'bold'}}>+{ach.reward} XP</span>
                          )}
                        </span>
                        <span className="profile__ach-progress">
                          {ach.total > 0 ? `${ach.progress} / ${ach.total}` : `Накоплено: ${ach.progress} XP`}
                        </span>
                      </div>
                      <p className="profile__ach-desc">{ach.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="profile__right">
            <div className="profile__card profile__orders">
              <h3 className="profile__card-title">Ваши заказы ({orders.length})</h3>
              
              {orders.length === 0 ? (
                <p className="profile__no-orders">У вас пока нет заказов</p>
              ) : (
                <div className="profile__orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="profile__order-item">
                      <div className="profile__order-header">
                        <span className="profile__order-number">Заказ {order.orderNumber}</span>
                        <span className="profile__order-date">
                          {new Date(order.date).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <div className="profile__order-body">
                        <span>{order.items.length} товаров</span>
                        <span className="profile__order-total">{order.total.toLocaleString()} ₸</span>
                      </div>
                      <div className="profile__order-footer">
                        <span className={`profile__order-status profile__order-status--${order.status}`}>
                          {statusMap[order.status] || order.status}
                        </span>
                        {(order.status === 'pending' || order.status === 'confirmed') && (
                          <button 
                            className="profile__button profile__button--outline"
                            style={{ marginLeft: '10px', padding: '4px 12px', fontSize: '12px' }}
                            onClick={() => handleCancelClick(order.id)}
                          >
                            Отменить заказ
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileSection;
