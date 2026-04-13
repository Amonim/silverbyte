import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__column">
            <h3 className="footer__logo">SILVERBYTE</h3>
            <p className="footer__description">
              Современный интернет-магазин гаджетов и технологий
            </p>
          </div>

          <div className="footer__column">
            <h4 className="footer__title">Навигация</h4>
            <Link to="/" className="footer__link">
              Главная
            </Link>
            <Link to="/catalog" className="footer__link">
              Каталог
            </Link>
            <a href="#" className="footer__link">
              Корзина
            </a>
            <a href="#" className="footer__link">
              Войти
            </a>
          </div>

          <div className="footer__column">
            <h4 className="footer__title">Категории</h4>
            <a href="#" className="footer__link">
              Смартфоны
            </a>
            <a href="#" className="footer__link">
              Ноутбуки
            </a>
            <a href="#" className="footer__link">
              Компьютеры
            </a>
            <a href="#" className="footer__link">
              Аксессуары
            </a>
          </div>

          <div className="footer__column">
            <h4 className="footer__title">Контакты</h4>
            <p className="footer__text">Павлодар, Казахстан</p>
            <p className="footer__text">+7 776 148 81 04</p>
            <p className="footer__text">SilverByte@gmail.com</p>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2026 SilverByte. Разработано Абиевым Арыном Ондарбекавичем в рамках дипломного проекта.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
