import { useState, useEffect } from "react";
import { getAdminUsers, updateAdminUser, blockAdminUser, deleteAdminUser, type AdminUser } from "../../../api/usersApi";

const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await getAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlock = async (id: string | number) => {
    try {
      setActionError("");
      const updated = await blockAdminUser(id);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_blocked: updated.is_blocked } : u));
    } catch(e: any) {
      setActionError(e.message);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      setActionError("");
      await deleteAdminUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch(e: any) {
      setActionError(e.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      setActionError("");
      const updated = await updateAdminUser(editingUser.id, {
        name: editingUser.name,
        email: editingUser.email,
        xp: editingUser.xp,
        level: editingUser.level
      });
      setUsers(prev => prev.map(u => u.id === updated.id ? { ...u, ...updated } : u));
      setEditingUser(null);
    } catch(e: any) {
      setActionError(e.message);
    }
  };

  const filteredUsers = users.filter((u) =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ padding: "24px" }}>Загрузка пользователей...</div>;
  if (error) return <div style={{ padding: "24px", color: "red" }}>{error}</div>;

  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>Управление пользователями</h2>
      
      {actionError && (
        <div style={{ padding: "12px", background: "#fee", color: "red", borderRadius: "8px", marginBottom: "16px" }}>
          {actionError}
        </div>
      )}

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
              <th>Уровень</th>
              <th>XP</th>
              <th>Заказы</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={{ opacity: user.is_blocked ? 0.5 : 1 }}>
                <td>
                  <div className="admin-table__user-info">
                    <div className="admin-table__avatar" style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: 'var(--color-primary)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', fontSize: '16px'
                    }}>
                      {(user.name || "Б").charAt(0).toUpperCase()}
                    </div>
                    <span>{user.name || "Без имени"}</span>
                  </div>
                </td>
                <td>{user.email || "Без email"}</td>
                <td>{user.level || 1}</td>
                <td>{user.xp || 0}</td>
                <td>{Number(user.ordersCount) || 0}</td>
                <td>
                  <div className="admin-table__actions">
                    <button
                      className="admin-action-btn"
                      title="Редактировать"
                      onClick={() => setEditingUser(user)}
                    >
                      ✏️
                    </button>
                    <button
                      className="admin-action-btn"
                      title={user.is_blocked ? "Разблокировать" : "Заблокировать"}
                      onClick={() => handleBlock(user.id)}
                    >
                      {user.is_blocked ? "🔓" : "🔒"}
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

      {editingUser && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <form onSubmit={handleSave} style={{
            background: "var(--color-surface)", padding: "24px", borderRadius: "12px",
            width: "400px", maxWidth: "90%", display: "flex", flexDirection: "column", gap: "16px"
          }}>
            <h3>Редактировать пользователя</h3>
            
            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>Имя</label>
              <input 
                className="input-field"
                value={editingUser.name}
                onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>Email</label>
              <input 
                type="email"
                className="input-field"
                value={editingUser.email}
                onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>Уровень</label>
              <input 
                type="number"
                className="input-field"
                value={editingUser.level}
                onChange={e => setEditingUser({...editingUser, level: Number(e.target.value)})}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>XP</label>
              <input 
                type="number"
                className="input-field"
                value={editingUser.xp}
                onChange={e => setEditingUser({...editingUser, xp: Number(e.target.value)})}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <button type="submit" className="btn btn--primary" style={{ flex: 1 }}>
                Сохранить
              </button>
              <button type="button" className="btn btn--outline" style={{ flex: 1 }} onClick={() => setEditingUser(null)}>
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
