import { useState, useEffect } from "react";
import { getAdminUsers, updateAdminUser, blockAdminUser, deleteAdminUser, type AdminUser } from "../../../api/usersApi";
import { calculateProfileStats } from "../../../utils/profile";

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
        xp: editingUser.xp
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

  if (loading) return (
    <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text)" }}>
      <div style={{ fontSize: "24px", marginBottom: "16px" }}>Загрузка пользователей...</div>
      <div style={{ border: "4px solid var(--color-border)", borderTop: "4px solid var(--color-primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
  
  if (error) return (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <div style={{ display: "inline-block", background: "rgba(255,0,0,0.1)", color: "var(--color-danger)", padding: "20px 40px", borderRadius: "12px", border: "1px solid rgba(255,0,0,0.2)" }}>
        <h3>Произошла ошибка</h3>
        <p>{error}</p>
        <button className="admin-btn admin-btn--primary" onClick={fetchUsers} style={{ marginTop: "16px" }}>Повторить попытку</button>
      </div>
    </div>
  );

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
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const stats = calculateProfileStats(Number(user.ordersCount) || 0, user.xp || 0, false);
              return (
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
                <td>{stats.level}</td>
                <td>{stats.points}</td>
                <td>{Number(user.ordersCount) || 0}</td>
                <td>
                  {user.is_blocked ? (
                    <span style={{ background: "rgba(255,0,0,0.1)", color: "var(--color-danger)", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>Заблокирован</span>
                  ) : (
                    <span style={{ background: "rgba(0,128,0,0.1)", color: "var(--color-success)", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>Активен</span>
                  )}
                </td>
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
                      title="Удалить пользователя"
                      onClick={() => handleDelete(user.id)}
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--color-text-muted)" }}>
                  <h3>Пользователи не найдены</h3>
                  <p>По вашему запросу нет результатов.</p>
                </td>
              </tr>
            )}
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
                style={{
                  width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--color-border)",
                  background: "var(--color-bg)", color: "var(--color-text)", fontSize: "14px", boxSizing: "border-box"
                }}
                value={editingUser.name}
                onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>Email</label>
              <input 
                type="email"
                style={{
                  width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--color-border)",
                  background: "var(--color-bg)", color: "var(--color-text)", fontSize: "14px", boxSizing: "border-box"
                }}
                value={editingUser.email}
                onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>Базовый XP (до вычисления)</label>
              <input 
                type="number"
                style={{
                  width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--color-border)",
                  background: "var(--color-bg)", color: "var(--color-text)", fontSize: "14px", boxSizing: "border-box"
                }}
                value={editingUser.xp}
                onChange={e => setEditingUser({...editingUser, xp: Number(e.target.value)})}
                required
              />
              <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "6px" }}>
                Итоговый уровень рассчитывается автоматически на основе XP и заказов.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <button type="submit" className="admin-btn admin-btn--primary" style={{ flex: 1, padding: "10px", borderRadius: "6px" }}>
                Сохранить
              </button>
              <button type="button" className="admin-btn" style={{ flex: 1, padding: "10px", borderRadius: "6px", background: "transparent", color: "var(--color-text)", border: "1px solid var(--color-border)" }} onClick={() => setEditingUser(null)}>
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
