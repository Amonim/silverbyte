import smartphoneImg from "/images/smartphone.png";
import laptopImg from "/images/laptop.png";
import computerImg from "/images/computer.png";
import peripheryImg from "/images/periphery.png";
import { useNavigate } from "react-router-dom";

function Features() {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent, category: string) => {
    e.preventDefault();
    navigate(`/catalog?category=${category}`);
  };

  return (
    <section className="features">
      <div className="features__grid">
        <div 
          className="feature-card" 
          onClick={(e) => handleCardClick(e, "smartphones")}
          style={{ cursor: "pointer" }}
        >
          <div className="feature-card__image-link">
            <img
              src={smartphoneImg}
              alt="Смартфоны"
              className="feature-card__image"
            />
          </div>
          <div className="feature-card__content">
            <h3>СМАРФОНЫ</h3>
            <p>Современные устройства для общения</p>
          </div>
        </div>

        <div 
          className="feature-card" 
          onClick={(e) => handleCardClick(e, "laptops")}
          style={{ cursor: "pointer" }}
        >
          <div className="feature-card__image-link">
            <img
              src={laptopImg}
              alt="Ноутбуки"
              className="feature-card__image"
            />
          </div>
          <div className="feature-card__content">
            <h3>НОУТБУКИ</h3>
            <p>Мощные решения для работы</p>
          </div>
        </div>

        <div 
          className="feature-card" 
          onClick={(e) => handleCardClick(e, "computers")}
          style={{ cursor: "pointer" }}
        >
          <div className="feature-card__image-link">
            <img
              src={computerImg}
              alt="Компьютеры"
              className="feature-card__image"
            />
          </div>
          <div className="feature-card__content">
            <h3>КОМПЬЮТЕРЫ</h3>
            <p>Высокая производительность для любых задач</p>
          </div>
        </div>

        <div 
          className="feature-card" 
          onClick={(e) => handleCardClick(e, "periphery")}
          style={{ cursor: "pointer" }}
        >
          <div className="feature-card__image-link">
            <img
              src={peripheryImg}
              alt="Периферия"
              className="feature-card__image"
            />
          </div>
          <div className="feature-card__content">
            <h3>ПЕРИФЕРИЯ</h3>
            <p>Полезные гаджеты и аксессуары</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
