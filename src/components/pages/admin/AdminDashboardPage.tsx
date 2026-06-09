
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

  if (loading) return (
    <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text)" }}>
      <div style={{ fontSize: "24px", marginBottom: "16px" }}>Загрузка панели...</div>
      <div style={{ border: "4px solid var(--color-border)", borderTop: "4px solid var(--color-primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
  
  if (error) return (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <div style={{ display: "inline-block", background: "rgba(255,0,0,0.1)", color: "var(--color-danger)", padding: "20px 40px", borderRadius: "12px", border: "1px solid rgba(255,0,0,0.2)" }}>
        <h3>Произошла ошибка</h3>
        <p>{error}</p>
        <button className="admin-btn admin-btn--primary" onClick={fetchDashboard} style={{ marginTop: "16px" }}>Повторить попытку</button>
      </div>
    </div>
  );
  if (!data) return null;

  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>Панель управления</h2>

      <div className="admin-dashboard__grid">
        <div className="admin-card">
          <div className="admin-card__title">💰 Общий доход (все)</div>
          <div className="admin-card__value">
            {data.totalRevenue.toLocaleString("ru-RU")} ₸
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card__title">✅ Доход (доставленные)</div>
          <div className="admin-card__value" style={{ color: "var(--color-success)" }}>
            {data.deliveredRevenue.toLocaleString("ru-RU")} ₸
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card__title">🛒 Всего заказов</div>
          <div className="admin-card__value">{data.totalOrders}</div>
        </div>
        <div className="admin-card">
          <div className="admin-card__title">📦 Доставленные заказы</div>
          <div className="admin-card__value" style={{ color: "var(--color-success)" }}>{data.deliveredOrders}</div>
        </div>
        <div className="admin-card">
          <div className="admin-card__title">❌ Отменённые заказы</div>
          <div className="admin-card__value" style={{ color: "var(--color-danger)" }}>{data.cancelledOrders}</div>
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
