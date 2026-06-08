
import { products } from "../../../data/product";
import { mockAdminOrders } from "../../../data/adminOrders";
import { mockAdminUsers } from "../../../data/adminUsers";

const AdminDashboardPage = () => {
  const totalRevenue = mockAdminOrders.reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>Панель управления</h2>

      <div className="admin-dashboard__grid">
        <div className="admin-card">
          <div className="admin-card__title">💰 Общий доход</div>
          <div className="admin-card__value">
            {totalRevenue.toLocaleString("ru-RU")} ₸
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card__title">🛒 Всего заказов</div>
          <div className="admin-card__value">{mockAdminOrders.length}</div>
        </div>
        <div className="admin-card">
          <div className="admin-card__title">👥 Всего пользователей</div>
          <div className="admin-card__value">{mockAdminUsers.length}</div>
        </div>
        <div className="admin-card">
          <div className="admin-card__title">📦 Всего товаров</div>
          <div className="admin-card__value">{products.length}</div>
        </div>
      </div>

      <h3 style={{ marginBottom: "16px" }}>Последние заказы</h3>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Клиент</th>
              <th>Сумма</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {mockAdminOrders.slice(0, 3).map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerName}</td>
                <td>{order.totalPrice.toLocaleString("ru-RU")} ₸</td>
                <td>
                  <span
                    className={`admin-status ${
                      order.status === "Доставлен"
                        ? "admin-status--delivered"
                        : order.status === "Подтвержден"
                        ? "admin-status--confirmed"
                        : order.status === "Передан курьеру"
                        ? "admin-status--shipped"
                        : "admin-status--pending"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
