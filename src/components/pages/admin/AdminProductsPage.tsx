import React, { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../../api/productsApi";
import type { Product } from "../../../data/product";

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [appError, setAppError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "smartphones" as Product["category"],
    price: "",
    images: "",
    description: "",
    brand: "",
    model: "",
    warranty: "",
  });

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setAppError("Не удалось загрузить товары");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      category: "smartphones",
      price: "",
      images: "",
      description: "",
      brand: "",
      model: "",
      warranty: "",
    });
    setModalError("");
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      category: product.category,
      price: product.price.toString(),
      images: product.images.join(", "),
      description: product.description,
      brand: product.specs.brand || "",
      model: product.specs.model || "",
      warranty: product.specs.warranty || "",
    });
    setModalError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setAppError("");
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err: any) {
      setAppError(err.message || "Ошибка при удалении товара");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setModalLoading(true);

    try {
      const priceNum = parseInt(formData.price, 10);
      if (isNaN(priceNum) || priceNum < 0) {
        throw new Error("Цена должна быть положительным числом");
      }

      const imgArray = formData.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (imgArray.length === 0) {
        throw new Error("Укажите хотя бы одну ссылку на изображение");
      }

      const newProductData = {
        title: formData.title,
        category: formData.category,
        price: priceNum,
        images: imgArray,
        description: formData.description,
        specs: {
          brand: formData.brand,
          model: formData.model,
          category: formData.category,
          warranty: formData.warranty,
        },
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, newProductData);
      } else {
        await createProduct(newProductData);
      }

      setIsModalOpen(false);
      loadProducts();
    } catch (err: any) {
      setModalError(err.message || "Произошла ошибка при сохранении");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>Управление товарами</h2>

      {appError && (
        <div style={{ padding: "12px", background: "rgba(255,0,0,0.1)", color: "red", borderRadius: "8px", marginBottom: "20px" }}>
          {appError}
          <button 
            onClick={() => setAppError("")} 
            style={{ float: "right", background: "none", border: "none", cursor: "pointer", color: "red" }}
          >
            ✕
          </button>
        </div>
      )}

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
            <button className="admin-btn admin-btn--primary" onClick={openAddModal}>
              + Добавить товар
            </button>
          </div>
        </div>

        {isLoading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text)" }}>
            <div style={{ fontSize: "24px", marginBottom: "16px" }}>Загрузка товаров...</div>
            <div style={{ border: "4px solid var(--color-border)", borderTop: "4px solid var(--color-primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }} />
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Товар</th>
                <th>Категория</th>
                <th>Цена</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-table__product-info">
                      <img
                        src={product.images[0] || "https://via.placeholder.com/40"}
                        alt={product.title}
                        className="admin-table__product-img"
                      />
                      <span>{product.title}</span>
                    </div>
                  </td>
                  <td style={{ textTransform: "capitalize" }}>{product.category}</td>
                  <td>{product.price.toLocaleString("ru-RU")} ₸</td>
                  <td>
                    <div className="admin-table__actions">
                      <button 
                        className="admin-action-btn admin-action-btn--edit" 
                        title="Редактировать"
                        onClick={() => openEditModal(product)}
                      >
                        ✎
                      </button>
                      <button 
                        className="admin-action-btn admin-action-btn--delete" 
                        title="Удалить"
                        onClick={() => handleDelete(product.id)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "40px", color: "var(--color-text-muted)" }}>
                    <h3>Товары не найдены</h3>
                    <p>Измените параметры поиска или добавьте новый товар.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "var(--card-bg, #fff)",
            color: "var(--text, #000)",
            padding: "30px",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "600px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "20px", fontSize: "24px" }}>
              {editingProduct ? "Редактировать товар" : "Новый товар"}
            </h3>
            
            {modalError && (
              <div style={{ color: "red", marginBottom: "15px", padding: "10px", background: "rgba(255,0,0,0.1)", borderRadius: "6px" }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Название</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} 
                />
              </div>

              <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Категория</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                  >
                    <option value="smartphones">Смартфоны</option>
                    <option value="laptops">Ноутбуки</option>
                    <option value="computers">Компьютеры</option>
                    <option value="periphery">Периферия</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Цена (₸)</label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Ссылки на изображения (через запятую)</label>
                <input 
                  type="text" 
                  required 
                  placeholder="/images/product1.png, /images/product2.png"
                  value={formData.images} 
                  onChange={(e) => setFormData({...formData, images: e.target.value})}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} 
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Описание</label>
                <textarea 
                  required 
                  rows={3}
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", resize: "vertical" }} 
                />
              </div>

              <h4 style={{ margin: "10px 0 5px" }}>Характеристики</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <input type="text" placeholder="Бренд (Apple, Samsung)" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} required />
                <input type="text" placeholder="Модель" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} required />
                <input type="text" placeholder="Гарантия (1 год)" value={formData.warranty} onChange={e => setFormData({...formData, warranty: e.target.value})} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} required />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: "10px 20px", background: "#f1f1f1", color: "#333", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                >
                  Отмена
                </button>
                <button 
                  type="submit" 
                  disabled={modalLoading}
                  style={{ padding: "10px 20px", background: "var(--primary, #007bff)", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                >
                  {modalLoading ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
