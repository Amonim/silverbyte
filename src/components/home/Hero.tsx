import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
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
