import pool from './db';
import { products } from '../src/data/product';

async function runMigration() {
  console.log('Начинаем миграцию таблицы products...');
  
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        price INTEGER NOT NULL,
        images JSONB NOT NULL,
        description TEXT NOT NULL,
        specs JSONB NOT NULL
      );
    `);
    console.log('Таблица products создана или уже существует.');

    await pool.query('TRUNCATE TABLE products RESTART IDENTITY CASCADE');
    console.log('Таблица очищена перед вставкой данных.');

    for (const product of products) {
      await pool.query(
        `INSERT INTO products (id, title, category, price, images, description, specs) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          product.id,
          product.title,
          product.category,
          product.price,
          JSON.stringify(product.images),
          product.description,
          JSON.stringify(product.specs)
        ]
      );
    }
    
    // Сбросим сиквенс, чтобы новые инсерты не падали из-за конфликта primary key
    await pool.query(`SELECT setval('products_id_seq', (SELECT MAX(id) FROM products))`);
    
    console.log(`Успешно перенесено ${products.length} товаров в PostgreSQL!`);
  } catch (error) {
    console.error('Ошибка при миграции:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
