import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email === "admin@mail.ru" && password === "qwerty") {
      localStorage.setItem("adminAuth", "true");
      navigate("/admin");
    } else {
      setError("Неверный email или пароль");
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
