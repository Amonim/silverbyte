import React, { useState } from "react";
import { mockAdminOrders, type AdminOrder } from "../../../data/adminOrders";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState(mockAdminOrders);

  const handleStatusChange = (id: string, newStatus: AdminOrder["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

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
                <td>{order.customerName}</td>
                <td>{order.totalPrice.toLocaleString("ru-RU")} ₸</td>
                <td>{new Date(order.date).toLocaleDateString("ru-RU")}</td>
                <td>
                  <select
                    className="admin-select"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value as AdminOrder["status"])
                    }
                  >
                    <option value="В обработке">В обработке</option>
                    <option value="Подтвержден">Подтвержден</option>
                    <option value="Передан курьеру">Передан курьеру</option>
                    <option value="Доставлен">Доставлен</option>
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
