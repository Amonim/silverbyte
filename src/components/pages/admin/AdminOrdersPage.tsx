import { useState, useEffect } from "react";

interface Order {
  id: string;
  order_number: string;
  date: string;
  total: number;
  customer_info: string | any;
  status: string;
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders");
      if (!res.ok) throw new Error("Ошибка при загрузке заказов");
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Не удалось обновить статус");
      }

      const updatedOrder = await res.json();
      
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: updatedOrder.status } : order
        )
      );
    } catch (err) {
      console.error(err);
      alert("Ошибка при обновлении статуса заказа");
    }
  };

  const parseCustomerName = (info: any) => {
    if (!info) return "Неизвестный клиент";
    try {
      const parsed = typeof info === "string" ? JSON.parse(info) : info;
      return parsed.name || "Неизвестный клиент";
    } catch (e) {
      return "Неизвестный клиент";
    }
  };

  if (loading) return <div style={{ padding: "24px" }}>Загрузка заказов...</div>;
  if (error) return <div style={{ padding: "24px", color: "red" }}>{error}</div>;

  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>Управление заказами</h2>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID Заказа</th>
              <th>Клиент</th>
              <th>Сумма</th>
              <th>Дата</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{parseCustomerName(order.customer_info)}</td>
                <td>{order.total?.toLocaleString("ru-RU")} ₸</td>
                <td>{new Date(order.date).toLocaleDateString("ru-RU")}</td>
                <td>
                  <select
                    className="admin-select"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <option value="pending">pending (В обработке)</option>
                    <option value="confirmed">confirmed (Подтвержден)</option>
                    <option value="shipped">shipped (Передан курьеру)</option>
                    <option value="delivered">delivered (Доставлен)</option>
                    <option value="cancelled">cancelled (Отменен)</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
