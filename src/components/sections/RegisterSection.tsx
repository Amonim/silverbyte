import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function RegisterSection() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Заполните все поля");
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

        if (password.length > 6) {
      setError("пароль менее 6 символов");
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerUser(name, email, password);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSuccess(result.message);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth">
      <div className="container">
        <div className="auth__box">
          <h1 className="auth__title">Регистрация</h1>

          <form className="auth__form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Имя"
              className="auth__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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

            <input
              type="password"
              placeholder="Повторите пароль"
              className="auth__input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && <p className="auth__error">{error}</p>}
            {success && <p className="auth__success">{success}</p>}

            <button className="auth__button" type="submit" disabled={isLoading}>
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
          </form>

          <p className="auth__switch">
            Уже есть аккаунт?{" "}
            <Link to="/login" className="auth__link">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default RegisterSection;
