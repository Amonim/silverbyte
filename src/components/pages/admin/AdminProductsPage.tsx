import React, { useState } from "react";
import { products } from "../../../data/product";

const AdminProductsPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>Управление товарами</h2>

      <div className="admin-table-container">
        <div className="admin-table-header">
          <div className="admin-table-header__search">
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="admin-table-header__actions">
            <select
              className="admin-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">Все категории</option>
              <option value="smartphones">Смартфоны</option>
              <option value="laptops">Ноутбуки</option>
              <option value="computers">Компьютеры</option>
              <option value="periphery">Периферия</option>
            </select>
            <button className="admin-btn admin-btn--primary">+ Добавить</button>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Товар</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>Остаток</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="admin-table__product-info">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="admin-table__product-img"
                    />
                    <span>{product.title}</span>
                  </div>
                </td>
                <td style={{ textTransform: "capitalize" }}>{product.category}</td>
                <td>{product.price.toLocaleString("ru-RU")} ₸</td>
                <td>{Math.floor(Math.random() * 50) + 1} шт.</td>
                <td>
                  <div className="admin-table__actions">
                    <button className="admin-action-btn admin-action-btn--edit" title="Редактировать">
                      ✎
                    </button>
                    <button className="admin-action-btn admin-action-btn--delete" title="Удалить">
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductsPage;
