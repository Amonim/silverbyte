import { useState } from "react";
import { mockAdminUsers } from "../../../data/adminUsers";

const AdminUsersPage = () => {
  const [users, setUsers] = useState(mockAdminUsers);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleBlock = (id: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, isBlocked: !user.isBlocked } : user
      )
    );
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>Управление пользователями</h2>

      <div className="admin-table-container">
        <div className="admin-table-header">
          <div className="admin-table-header__search">
            <input
              type="text"
              placeholder="Поиск пользователей..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Email</th>
              <th>Регистрация</th>
              <th>Заказы</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={{ opacity: user.isBlocked ? 0.5 : 1 }}>
                <td>
                  <div className="admin-table__user-info">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="admin-table__avatar"
                    />
                    <span>{user.username}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{new Date(user.registrationDate).toLocaleDateString("ru-RU")}</td>
                <td>{user.ordersCount}</td>
                <td>
                  <div className="admin-table__actions">
                    <button
                      className="admin-action-btn"
                      title={user.isBlocked ? "Разблокировать" : "Заблокировать"}
                      onClick={() => handleToggleBlock(user.id)}
                    >
                      {user.isBlocked ? "🔓" : "🔒"}
                    </button>
                    <button
                      className="admin-action-btn admin-action-btn--delete"
                      title="Удалить"
                      onClick={() => handleDelete(user.id)}
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
