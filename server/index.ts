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

    // Update users.json
    if (order.userEmail) {
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
      return res.json(result.rows);
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

app.get('/api/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    const users = JSON.parse(data);
    const user = users.find((u: any) => u.email === email);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.json({ email, xp: 0 });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.patch('/api/orders/:orderId/cancel', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userEmail } = req.body;

    const ordersData = await fs.readFile(ORDERS_FILE, 'utf-8');
    const orders = JSON.parse(ordersData);
    
    const orderIndex = orders.findIndex((o: any) => o.id === orderId && o.userEmail === userEmail);
    
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[orderIndex];

    if (order.status === 'cancelled') {
      return res.json(order);
    }

    order.status = 'cancelled';
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));

    if (userEmail) {
      const usersData = await fs.readFile(USERS_FILE, 'utf-8');
      const users = JSON.parse(usersData);
      const userIndex = users.findIndex((u: any) => u.email === userEmail);

      if (userIndex !== -1) {
        const orderXP = order.xp || Math.floor(order.total / 1000);
        users[userIndex].xp = Math.max(0, (users[userIndex].xp || 0) - orderXP);
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    const users = JSON.parse(data);
    
    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      xp: 0
    };

    users.push(newUser);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    const users = JSON.parse(data);
    
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
