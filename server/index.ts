import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import pool from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

app.use(cors());
app.use(express.json());

async function initStorage() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(ORDERS_FILE);
    } catch {
      await fs.writeFile(ORDERS_FILE, JSON.stringify([]));
    }
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify([]));
    }
  } catch (err) {
    console.error('Error initializing storage:', err);
  }
}
initStorage();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ success: false, error: 'Database connection failed' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { title, category, price, images, description, specs } = req.body;
    if (!title || !category || price === undefined || !images || !description || !specs) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // We pass specs as JSON string, and images as JSON string (or array if node-postgres supports it, let's pass stringified JSON)
    const result = await pool.query(
      `INSERT INTO products (title, category, price, images, description, specs) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, category, price, JSON.stringify(images), description, JSON.stringify(specs)]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.patch('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, price, images, description, specs } = req.body;
    
    if (!title || !category || price === undefined || !images || !description || !specs) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await pool.query(
      `UPDATE products 
       SET title = $1, category = $2, price = $3, images = $4, description = $5, specs = $6
       WHERE id = $7 RETURNING *`,
      [title, category, price, JSON.stringify(images), description, JSON.stringify(specs), id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const orderCheck = await pool.query('SELECT order_id FROM order_items WHERE product_id = $1 LIMIT 1', [id]);
    
    if (orderCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Невозможно удалить товар: он содержится в существующих заказах.' 
      });
    }
    
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.post('/api/orders', async (req, res) => {
  const client = await pool.connect();
  try {
    const order = req.body;
    
    const xp = Math.floor(order.total / 1000);
    order.xp = xp;

    await client.query('BEGIN');

    // 1. Check products
    for (const item of order.items) {
      const productCheck = await client.query('SELECT id FROM products WHERE id = $1', [item.id]);
      if (productCheck.rows.length === 0) {
        throw new Error(`Product with ID ${item.id} not found`);
      }
    }

    // 2. Insert order
    await client.query(
      `INSERT INTO orders 
       (id, order_number, date, subtotal, discount_percent, discount_amount, total, customer_info, payment_method, status, user_prefix, user_email, xp)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        order.id, order.orderNumber, order.date, order.subtotal, 
        order.discountPercent, order.discountAmount, order.total, 
        JSON.stringify(order.customerInfo), order.paymentMethod, 
        order.status, order.userPrefix, order.userEmail, xp
      ]
    );

    // 3. Insert order items
    for (const item of order.items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.id, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');

    // Update Postgres users table
    if (order.userEmail) {
      try {
        const userCheck = await client.query('SELECT xp FROM users WHERE email = $1', [order.userEmail]);
        if (userCheck.rows.length > 0) {
          const newXp = userCheck.rows[0].xp + xp;
          let level = 1;
          const LEVELS = [0, 300, 700, 1500, 3000];
          for (let i = 0; i < LEVELS.length; i++) if (newXp >= LEVELS[i]) level = i + 1;
          if (level > 5) level = 5;
          await client.query('UPDATE users SET xp = $1, level = $2 WHERE email = $3', [newXp, level, order.userEmail]);
        }
      } catch (dbErr) {
        console.error('Failed to update user XP in database:', dbErr);
      }
      
      try {
        const usersData = await fs.readFile(USERS_FILE, 'utf-8');
        const users = JSON.parse(usersData);
        const userIndex = users.findIndex((u: any) => u.email === order.userEmail);

        if (userIndex !== -1) {
          users[userIndex].xp += xp;
        } else {
          users.push({ email: order.userEmail, xp });
        }
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
      } catch (userErr) {
        console.error('Failed to update users.json:', userErr);
      }
    }

    res.status(201).json(order);
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Failed to save order:', error);
    res.status(500).json({ error: error.message || 'Failed to save order' });
  } finally {
    client.release();
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY date DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // UUID format check (simple regex to avoid crashing if id is a userEmail from old endpoints)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      // Fallback to fetch by userEmail for compatibility if needed
      const result = await pool.query('SELECT * FROM orders WHERE user_email = $1 ORDER BY date DESC', [id]);
      const orders = result.rows;
      for (let order of orders) {
        const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
        order.items = itemsResult.rows;
      }
      return res.json(orders);
    }

    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orderResult.rows[0];
    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    order.items = itemsResult.rows;
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, xp, level FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Support fetching by email for backward compatibility with old endpoints
    let result;
    if (id.includes('@')) {
      result = await pool.query('SELECT id, name, email, xp, level FROM users WHERE email = $1', [id]);
    } else {
      result = await pool.query('SELECT id, name, email, xp, level FROM users WHERE id = $1', [id]);
    }
    
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      // Fallback for guest users
      res.json({ email: id.includes('@') ? id : '', xp: 0, level: 1 });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.patch('/api/orders/:orderId/cancel', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userEmail } = req.body;

    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1 AND user_email = $2', [orderId, userEmail]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    if (order.status === 'cancelled') {
      return res.json(order);
    }

    await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['cancelled', orderId]);
    order.status = 'cancelled';

    if (userEmail) {
      const orderXP = order.xp || Math.floor(order.total / 1000);
      try {
        const userCheck = await pool.query('SELECT xp FROM users WHERE email = $1', [userEmail]);
        if (userCheck.rows.length > 0) {
          const newXp = Math.max(0, userCheck.rows[0].xp - orderXP);
          let level = 1;
          const LEVELS = [0, 300, 700, 1500, 3000];
          for (let i = 0; i < LEVELS.length; i++) if (newXp >= LEVELS[i]) level = i + 1;
          if (level > 5) level = 5;
          await pool.query('UPDATE users SET xp = $1, level = $2 WHERE email = $3', [newXp, level, userEmail]);
        }
      } catch (dbErr) {
        console.error('Failed to update user XP in database:', dbErr);
      }

      try {
        const usersData = await fs.readFile(USERS_FILE, 'utf-8');
        const users = JSON.parse(usersData);
        const userIndex = users.findIndex((u: any) => u.email === userEmail);

        if (userIndex !== -1) {
          users[userIndex].xp = Math.max(0, (users[userIndex].xp || 0) - orderXP);
          await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
        }
      } catch (fileErr) {
        console.error('Failed to update user XP in users.json:', fileErr);
      }
    }

    res.json(order);
  } catch (error) {
    console.error('Failed to cancel order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    const result = await pool.query(
      'INSERT INTO users (name, email, password, xp, level) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, xp, level',
      [name, email, password, 0, 1]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query('SELECT id, name, email, xp, level FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
