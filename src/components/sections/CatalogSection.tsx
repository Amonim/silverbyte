import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { addToCart } from "../../utils/cart";
import FavoriteButton from "../product/FavoriteButton";
import { getProducts } from "../../api/productsApi";
import type { Product } from "../../data/product";

const PRODUCTS_PER_PAGE = 9;

function CatalogSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.trim().toLowerCase() || "";
  const queryCategory = searchParams.get("category");

  const [category, setCategory] = useState(queryCategory || "all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("default");

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (queryCategory) {
      setCategory(queryCategory);
      setCurrentPage(1);
    } else {
      setCategory("all");
    }
  }, [queryCategory]);
  const [imageIndexes, setImageIndexes] = useState<Record<number, number>>({});

  const getCurrentImageIndex = (productId: number) => {
    return imageIndexes[productId] ?? 0;
  };

  const handlePrevImage = (
    event: React.MouseEvent<HTMLButtonElement>,
    productId: number,
    totalImages: number
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setImageIndexes((prev) => {
      const currentIndex = prev[productId] ?? 0;
      const newIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;

      return {
        ...prev,
        [productId]: newIndex,
      };
    });
  };

  const handleNextImage = (
    event: React.MouseEvent<HTMLButtonElement>,
    productId: number,
    totalImages: number
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setImageIndexes((prev) => {
      const currentIndex = prev[productId] ?? 0;
      const newIndex =
        currentIndex === totalImages - 1 ? 0 : currentIndex + 1;

      return {
        ...prev,
        [productId]: newIndex,
      };
    });
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    if (category !== "all") {
      result = result.filter((product) => product.category === category);
    }

    if (searchQuery) {
      result = result.filter((product) => {
        return (
          product.title.toLowerCase().includes(searchQuery) ||
          product.specs.brand.toLowerCase().includes(searchQuery) ||
          product.specs.category.toLowerCase().includes(searchQuery)
        );
      });
    }

    return result;
  }, [category, searchQuery, products]);

  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];
    switch (sortBy) {
      case "price-asc":
        return result.sort((a, b) => a.price - b.price);
      case "price-desc":
        return result.sort((a, b) => b.price - a.price);
      case "name-asc":
        return result.sort((a, b) => a.title.localeCompare(b.title));
      case "name-desc":
        return result.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return result;
    }
  }, [filteredProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, currentPage]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setCurrentPage(1);

    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      if (newCategory === "all") {
        newParams.delete("category");
      } else {
        newParams.set("category", newCategory);
      }
      return newParams;
    });
  };

  return (
    <section className="catalog">
      <div className="container">
        <h1 className="catalog__title">Каталог товаров</h1>

        {isLoading ? (
          <p>Загрузка каталога...</p>
        ) : (
          <>

        {searchQuery && (
          <p className="catalog__search-result">
            Результаты поиска: <span>"{searchQuery}"</span>
          </p>
        )}

        <div className="catalog__layout">
          <aside className="catalog__sidebar">
            <h3 className="catalog__sidebar-title">Категории</h3>

            <button
              className={
                category === "all"
                  ? "catalog__filter-btn catalog__filter-btn--active"
                  : "catalog__filter-btn"
              }
              onClick={() => handleCategoryChange("all")}
            >
              Все
            </button>

            <button
              className={
                category === "smartphones"
                  ? "catalog__filter-btn catalog__filter-btn--active"
                  : "catalog__filter-btn"
              }
              onClick={() => handleCategoryChange("smartphones")}
            >
              Смартфоны
            </button>

            <button
              className={
                category === "laptops"
                  ? "catalog__filter-btn catalog__filter-btn--active"
                  : "catalog__filter-btn"
              }
              onClick={() => handleCategoryChange("laptops")}
            >
              Ноутбуки
            </button>

            <button
              className={
                category === "computers"
                  ? "catalog__filter-btn catalog__filter-btn--active"
                  : "catalog__filter-btn"
              }
              onClick={() => handleCategoryChange("computers")}
            >
              Компьютеры
            </button>

            <button
              className={
                category === "periphery"
                  ? "catalog__filter-btn catalog__filter-btn--active"
                  : "catalog__filter-btn"
              }
              onClick={() => handleCategoryChange("periphery")}
            >
              Периферия
            </button>
          </aside>

          <div className="catalog__content">
            <div className="catalog__actions">
              <div className="catalog__count">
                Найдено товаров: <span>{sortedProducts.length}</span>
              </div>
              <div className="catalog__sort">
                <label htmlFor="sort-select">Сортировка:</label>
                <select
                  id="sort-select"
                  className="catalog__sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">По умолчанию</option>
                  <option value="price-asc">Дешевле</option>
                  <option value="price-desc">Дороже</option>
                  <option value="name-asc">По названию (А-Я)</option>
                  <option value="name-desc">По названию (Я-А)</option>
                </select>
              </div>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="catalog__empty">
                <h2 className="catalog__empty-title">Ничего не найдено</h2>
                <p className="catalog__empty-text">
                  Попробуйте изменить поисковый запрос или выбрать другую
                  категорию.
                </p>
              </div>
            ) : (
              <>
                <div className="catalog__grid">
                  {paginatedProducts.map((product) => (
                    <article className="catalog-card" key={product.id}>
                      <FavoriteButton productId={product.id} className="catalog-card__fav-btn" />
                      <Link
                        to={`/product/${product.id}`}
                        className="catalog-card__image-link"
                      >
                        <div className="catalog-card__image-wrapper">
                          <img
                            src={
                              product.images[
                              getCurrentImageIndex(product.id)
                              ]
                            }
                            alt={product.title}
                            className="catalog-card__image"
                          />

                          {product.images.length > 1 && (
                            <>
                              <button
                                type="button"
                                className="catalog-card__arrow catalog-card__arrow--left"
                                onClick={(event) =>
                                  handlePrevImage(
                                    event,
                                    product.id,
                                    product.images.length
                                  )
                                }
                                aria-label="Предыдущее изображение"
                              >
                                ‹
                              </button>

                              <button
                                type="button"
                                className="catalog-card__arrow catalog-card__arrow--right"
                                onClick={(event) =>
                                  handleNextImage(
                                    event,
                                    product.id,
                                    product.images.length
                                  )
                                }
                                aria-label="Следующее изображение"
                              >
                                ›
                              </button>

                              <div className="catalog-card__dots">
                                {product.images.map((_, index) => (
                                  <span
                                    key={index}
                                    className={
                                      index ===
                                        getCurrentImageIndex(product.id)
                                        ? "catalog-card__dot catalog-card__dot--active"
                                        : "catalog-card__dot"
                                    }
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </Link>

                      <Link to={`/product/${product.id}`}>
                        <h3 className="catalog-card__title">
                          {product.title}
                        </h3>
                      </Link>

                      <p className="catalog-card__price">
                        {product.price.toLocaleString()} ₸
                      </p>

                      <button
                        className="catalog-card__button"
                        type="button"
                        onClick={() => addToCart(product)}
                      >
                        В корзину
                      </button>
                    </article>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="catalog__pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        className={
                          currentPage === index + 1
                            ? "catalog__page-btn catalog__page-btn--active"
                            : "catalog__page-btn"
                        }
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        </>
        )}
      </div>
    </section>
  );
}

export default CatalogSection;
