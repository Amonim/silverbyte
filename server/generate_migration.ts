import fs from 'fs';
import path from 'path';
import pool from './db';

async function generateMigration() {
  try {
    const productsRes = await pool.query('SELECT * FROM products ORDER BY id ASC');
    const products = productsRes.rows;

    const sqlFile = path.join(__dirname, 'migrations', 'init.sql');
    

    if (!fs.existsSync(path.dirname(sqlFile))) {
      fs.mkdirSync(path.dirname(sqlFile), { recursive: true });
    }

    let sql = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    is_blocked BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price INTEGER NOT NULL,
    images JSONB NOT NULL,
    description TEXT NOT NULL,
    specs JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    subtotal INTEGER NOT NULL,
    discount_percent INTEGER DEFAULT 0,
    discount_amount INTEGER DEFAULT 0,
    total INTEGER NOT NULL,
    customer_info JSONB NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    user_prefix VARCHAR(100),
    user_email VARCHAR(255),
    xp INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price_at_purchase INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_key VARCHAR(255) NOT NULL,
    UNIQUE(user_id, achievement_key)
);

`;

    sql += `
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM products LIMIT 1) THEN
`;

    for (const p of products) {
        const title = p.title.replace(/'/g, "''");
        const category = p.category.replace(/'/g, "''");
        const description = p.description.replace(/'/g, "''");
        const images = JSON.stringify(p.images).replace(/'/g, "''");
        const specs = JSON.stringify(p.specs).replace(/'/g, "''");
        
        sql += `        INSERT INTO products (id, title, category, price, images, description, specs) VALUES (${p.id}, '${title}', '${category}', ${p.price}, '${images}', '${description}', '${specs}');\n`;
    }
    

    sql += `
        PERFORM setval('products_id_seq', (SELECT MAX(id) FROM products));
    END IF;
END $$;
`;

    fs.writeFileSync(sqlFile, sql);

  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

generateMigration();
