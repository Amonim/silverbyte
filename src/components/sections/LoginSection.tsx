import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function LoginSection() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Заполните все поля");
      return;
    }

    const result = await loginUser(email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess(result.message);

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <section className="auth">
      <div className="container">
        <div className="auth__box">
          <h1 className="auth__title">Вход</h1>

          <form className="auth__form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="auth__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Пароль"
              className="auth__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="auth__error">{error}</p>}
            {success && <p className="auth__success">{success}</p>}

            <button className="auth__button" type="submit">
              Войти
            </button>
          </form>

          <p className="auth__switch">
            Нет аккаунта?{" "}
            <Link to="/register" className="auth__link">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default LoginSection;
