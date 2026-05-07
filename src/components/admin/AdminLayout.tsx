import React from "react";
import { Navigate, Outlet, Link, useLocation, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuth = localStorage.getItem("adminAuth") === "true";

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  const navLinks = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/products", label: "Products", icon: "📦" },
    { path: "/admin/orders", label: "Orders", icon: "🛒" },
    { path: "/admin/users", label: "Users", icon: "👥" },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <span className="admin-sidebar__logo">SilverByte</span>
        </div>
        <nav className="admin-sidebar__nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`admin-sidebar__link ${
                location.pathname === link.path ? "admin-sidebar__link--active" : ""
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar__logout">
          <button className="admin-sidebar__logout-btn" onClick={handleLogout}>
            <span>🚪</span> Выйти
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header__title">
            Панель управления
          </div>
          <div className="admin-header__user">
            <span>Администратор</span>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
