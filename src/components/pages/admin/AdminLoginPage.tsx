import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;
      
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminAuth", "true");
        navigate("/admin");
      } else {
        setError(data.message || "Неверный email или пароль");
      }
    } catch (err) {
      setError("Ошибка соединения с сервером");
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1 className="admin-login__title">SilverByte Admin</h1>
        <p className="admin-login__subtitle">Вход в панель управления</p>

        {error && <div className="admin-login__error">{error}</div>}

        <form className="admin-login__form" onSubmit={handleLogin}>
          <div className="admin-login__field">
            <label className="admin-login__label">Email</label>
            <input
              type="email"
              className="admin-login__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@silverbyte.kz"
              required
            />
          </div>
          <div className="admin-login__field">
            <label className="admin-login__label">Пароль</label>
            <input
              type="password"
              className="admin-login__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="admin-login__btn">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
