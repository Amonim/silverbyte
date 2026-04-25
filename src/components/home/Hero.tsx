import { useState, useEffect } from "react";
import heroBgDark from "/images/hero.png";
import heroBgLight from "/images/hero2.png";
import { Link } from "react-router-dom";

function Hero() {
  const [theme, setTheme] = useState(() => 
    document.documentElement.getAttribute("data-theme") || "dark"
  );

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          setTheme(document.documentElement.getAttribute("data-theme") || "dark");
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const heroBg = theme === "light" ? heroBgLight : heroBgDark;

  return (
    <section 
      className="hero" 
      style={{ 
        backgroundImage: `url(${heroBg})`,
        transition: "background-image 0.3s ease-in-out"
      }}
    >
      <div className="container">
        <div className="hero__content">
          <h1 className="hero__title">
            Лучшие гаджеты в <br /> одном месте
          </h1>

          <p className="hero__text">
            Смартфоны, ноутбуки, аксессуары — всё для твоего комфорта
          </p>

          <Link to="/catalog" className="hero__button">
            Смотреть товары
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
