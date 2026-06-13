import { useState, useEffect } from "react";

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

interface OrderItem {
  id: number;
  order_id: string;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
}

interface Order {
  id: string;
  order_number: string;
  date: string;
  total: number;
  customer_info: string | any;
  status: string;
  registered_user_name?: string;
  registered_user_email?: string;
  user_email?: string;
  items?: OrderItem[];
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`);
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
      setActionError("");
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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
      
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status: updatedOrder.status });
      }
    } catch (err: any) {
      console.error(err);
      setActionError(err.message || "Ошибка при обновлении статуса заказа");
    }
  };

  const handleViewOrder = async (orderId: string) => {
    setModalLoading(true);
    setSelectedOrder({ id: orderId } as Order);
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      if (!res.ok) throw new Error("Ошибка загрузки деталей заказа");
      const data = await res.json();
      setSelectedOrder(data);
    } catch (err: any) {
      setActionError(err.message || "Ошибка загрузки заказа");
      setSelectedOrder(null);
    } finally {
      setModalLoading(false);
    }
  };

  const parseCustomerInfo = (info: any) => {
    if (!info) return {};
    try {
      return typeof info === "string" ? JSON.parse(info) : info;
    } catch {
      return {};
    }
  };

  const parseCustomerName = (info: any, registeredName?: string) => {
    const parsed = parseCustomerInfo(info);
    if (parsed.fullName) return parsed.fullName;
    if (parsed.name) return parsed.name;
    if (registeredName) return registeredName;
    return "Неизвестный клиент";
  };

  if (loading) return (
    <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text)" }}>
      <div style={{ fontSize: "24px", marginBottom: "16px" }}>Загрузка заказов...</div>
      <div style={{ border: "4px solid var(--color-border)", borderTop: "4px solid var(--color-primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
  
  if (error) return (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <div style={{ display: "inline-block", background: "rgba(255,0,0,0.1)", color: "var(--color-danger)", padding: "20px 40px", borderRadius: "12px", border: "1px solid rgba(255,0,0,0.2)" }}>
        <h3>Произошла ошибка</h3>
        <p>{error}</p>
        <button className="admin-btn admin-btn--primary" onClick={fetchOrders} style={{ marginTop: "16px" }}>Повторить попытку</button>
      </div>
    </div>
  );

  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>Управление заказами</h2>

      {actionError && (
        <div style={{ padding: "12px 16px", background: "rgba(255,0,0,0.1)", color: "var(--color-danger)", borderRadius: "8px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{actionError}</span>
          <button onClick={() => setActionError("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-danger)", fontSize: "16px" }}>✕</button>
        </div>
      )}

      <div className="admin-table-container">
        {orders.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-muted)" }}>
            <h3>Список заказов пуст</h3>
            <p>Пока не было оформлено ни одного заказа.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID Заказа</th>
                <th>Клиент</th>
                <th>Сумма</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.order_number || order.id.slice(0, 8) + '...'}</td>
                  <td>{parseCustomerName(order.customer_info, order.registered_user_name)}</td>
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
                      <option value="pending">В обработке (pending)</option>
                      <option value="confirmed">Подтвержден (confirmed)</option>
                      <option value="shipped">Передан курьеру (shipped)</option>
                      <option value="delivered">Доставлен (delivered)</option>
                      <option value="cancelled">Отменен (cancelled)</option>
                    </select>
                  </td>
                  <td>
                    <button 
                      className="admin-action-btn"
                      onClick={() => handleViewOrder(order.id)}
                      title="Подробнее"
                    >
                      👁️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedOrder && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px"
        }}>
          <div style={{
            background: "var(--color-surface, #fff)", padding: "30px", borderRadius: "12px",
            width: "100%", maxWidth: "700px", maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)", position: "relative"
          }}>
            <button 
              onClick={() => setSelectedOrder(null)} 
              style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "var(--color-text)" }}
            >
              ✕
            </button>
            
            {modalLoading ? (
               <div style={{ padding: "40px", textAlign: "center" }}>Загрузка деталей заказа...</div>
            ) : selectedOrder.order_number ? (() => {
              const info = parseCustomerInfo(selectedOrder.customer_info);
              return (
                <div>
                  <h3 style={{ marginTop: 0, marginBottom: "20px", fontSize: "24px", borderBottom: "1px solid var(--color-border)", paddingBottom: "10px" }}>
                    Заказ {selectedOrder.order_number}
                  </h3>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                    <div>
                      <h4 style={{ marginBottom: "10px", color: "var(--color-text-muted)" }}>Информация о клиенте</h4>
                      <p style={{ margin: "5px 0" }}><strong>Имя:</strong> {parseCustomerName(selectedOrder.customer_info, selectedOrder.registered_user_name)}</p>
                      <p style={{ margin: "5px 0" }}><strong>Email:</strong> {info.email || selectedOrder.user_email || selectedOrder.registered_user_email || (selectedOrder as any).email || "Не указан"}</p>
                      <p style={{ margin: "5px 0" }}><strong>Телефон:</strong> {info.phone || "Не указан"}</p>
                    </div>
                    <div>
                      <h4 style={{ marginBottom: "10px", color: "var(--color-text-muted)" }}>Информация о доставке</h4>
                      <p style={{ margin: "5px 0" }}><strong>Адрес:</strong> {info.address || "Не указан"}</p>
                      <p style={{ margin: "5px 0" }}><strong>Дата создания:</strong> {new Date(selectedOrder.date).toLocaleString("ru-RU")}</p>
                      <div style={{ margin: "5px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                        <strong>Статус:</strong>
                        <select
                          className="admin-select"
                          value={selectedOrder.status}
                          onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                          style={{ padding: "4px 8px" }}
                        >
                          <option value="pending">В обработке</option>
                          <option value="confirmed">Подтвержден</option>
                          <option value="shipped">Передан курьеру</option>
                          <option value="delivered">Доставлен</option>
                          <option value="cancelled">Отменен</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <h4 style={{ marginBottom: "10px", color: "var(--color-text-muted)", borderBottom: "1px solid var(--color-border)", paddingBottom: "5px" }}>Товары в заказе</h4>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <table className="admin-table" style={{ marginBottom: "20px" }}>
                      <thead>
                        <tr>
                          <th>ID Товара</th>
                          <th>Кол-во</th>
                          <th>Цена за шт.</th>
                          <th>Сумма</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.product_id}</td>
                            <td>{item.quantity} шт.</td>
                            <td>{Number(item.price_at_purchase).toLocaleString("ru-RU")} ₸</td>
                            <td>{(item.quantity * item.price_at_purchase).toLocaleString("ru-RU")} ₸</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p style={{ padding: "10px", background: "var(--color-bg)", borderRadius: "8px" }}>Товары не найдены или не удалось загрузить.</p>
                  )}

                  <div style={{ textAlign: "right", fontSize: "20px", fontWeight: "bold", borderTop: "1px solid var(--color-border)", paddingTop: "15px" }}>
                    Итого к оплате: {selectedOrder.total?.toLocaleString("ru-RU")} ₸
                  </div>
                </div>
              );
            })() : (
               <div style={{ padding: "20px", color: "var(--color-danger)" }}>Не удалось загрузить данные заказа</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
