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
  try {
    const order = req.body;
    
    const xp = Math.floor(order.total / 1000);
    order.xp = xp;

    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    const orders = JSON.parse(data);
    orders.push(order);
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));

    if (order.userEmail) {
      const usersData = await fs.readFile(USERS_FILE, 'utf-8');
      const users = JSON.parse(usersData);
      const userIndex = users.findIndex((u: any) => u.email === order.userEmail);

      if (userIndex !== -1) {
        users[userIndex].xp += xp;
      } else {
        users.push({ email: order.userEmail, xp });
      }
      await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save order' });
  }
});

app.get('/api/orders/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params;
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    const orders = JSON.parse(data);
    const userOrders = orders.filter((o: any) => o.userEmail === userEmail);
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
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
