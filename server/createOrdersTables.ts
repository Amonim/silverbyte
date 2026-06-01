import pool from './db';

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        subtotal INTEGER NOT NULL,
        discount_percent INTEGER DEFAULT 0,
        discount_amount INTEGER DEFAULT 0,
        total INTEGER NOT NULL,
        customer_info JSONB NOT NULL,
        payment_method VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        user_prefix VARCHAR(100),
        user_email VARCHAR(255),
        xp INTEGER DEFAULT 0
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE RESTRICT,
        quantity INTEGER NOT NULL,
        price_at_purchase INTEGER NOT NULL
      );
    `);

    console.log('Таблицы orders и order_items успешно созданы!');
  } catch (err) {
    console.error('Ошибка создания таблиц:', err);
  } finally {
    pool.end();
  }
}

run();
