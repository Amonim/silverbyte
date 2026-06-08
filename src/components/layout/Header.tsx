import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import useFavorites from "../../hooks/useFavorites";
import { useTheme } from "../../hooks/useTheme";

function Header() {
  const { count } = useCart();
  const { favoritesCount } = useFavorites();
  const { user, authenticated, logoutUser } = useAuth();
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      navigate("/catalog");
      return;
    }

    navigate(`/catalog?search=${encodeURIComponent(normalizedQuery)}`);
    setQuery("");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__inner">
          <Link to="/" className="header__left">
            <div className="logo-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <rect x="6" y="6" width="12" height="12" rx="2" />
                <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
              </svg>
            </div>

            <div className="logo-text">SILVERBYTE</div>
          </Link>

          <div className="header__center">
            <form className="search-box" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Поиск гаджетов..."
                className="search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <button
                className="search-button"
                aria-label="Поиск"
                type="submit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="search-icon"
                >
                  <path
                    fill="currentColor"
                    d="M17.892 15.064a8 8 0 1 0-2.828 2.828l2.522 2.522a2 
                    2 0 1 0 2.828-2.828zM11 16a5 5 0 1 1 0-10 5 5 0 0 1 0 10"
                  />
                </svg>
              </button>
            </form>
          </div>

          <div className="header__right">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <span className="theme-toggle__icon theme-toggle__icon--dark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              </span>
              <span className="theme-toggle__icon theme-toggle__icon--light">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              </span>
              <span className="theme-toggle__slider" />
            </button>

            <Link to="/favorites" className="header-link header__favorites">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px', verticalAlign: 'middle'}}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {favoritesCount > 0 && <span className="header__cart-badge">{favoritesCount}</span>}
            </Link>

            <Link to="/cart" className="header-link header__cart">
              Корзина
              {count > 0 && <span className="header__cart-badge">{count}</span>}
            </Link>

            {!authenticated ? (
              <>
                <Link to="/login" className="header-link">
                  Войти
                </Link>
                <Link to="/register" className="header-link">
                  Регистрация
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="header-user">{user?.name}</Link>

                <button
                  className="header-link"
                  onClick={logoutUser}
                  type="button"
                >
                  Выйти
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
