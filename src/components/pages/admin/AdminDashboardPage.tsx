
import { useState, useEffect } from "react";
import { getDashboardData, type DashboardData } from "../../../api/adminDashboardApi";

const statusMap: Record<string, string> = {
  pending: "В обработке",
  confirmed: "Подтверждён",
  shipped: "Передан курьеру",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

const AdminDashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      const result = await getDashboardData();
      setData(result);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки панели управления");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div style={{ padding: "24px" }}>Загрузка панели...</div>;
  if (error) return <div style={{ padding: "24px", color: "red" }}>{error}</div>;
  if (!data) return null;

  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>Панель управления</h2>

      <div className="admin-dashboard__grid">
        <div className="admin-card">
          <div className="admin-card__title">💰 Общий доход</div>
          <div className="admin-card__value">
            {data.totalRevenue.toLocaleString("ru-RU")} ₸
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card__title">🛒 Всего заказов</div>
          <div className="admin-card__value">{data.totalOrders}</div>
        </div>
        <div className="admin-card">
          <div className="admin-card__title">👥 Всего пользователей</div>
          <div className="admin-card__value">{data.totalUsers}</div>
        </div>
        <div className="admin-card">
          <div className="admin-card__title">📦 Всего товаров</div>
          <div className="admin-card__value">{data.totalProducts}</div>
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
            {data.recentOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerName}</td>
                <td>{Number(order.total).toLocaleString("ru-RU")} ₸</td>
                <td>
                  <span className={`admin-status admin-status--${order.status}`}>
                    {statusMap[order.status] || order.status}
                  </span>
                </td>
              </tr>
            ))}
            {data.recentOrders.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "16px" }}>
                  Нет заказов
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
