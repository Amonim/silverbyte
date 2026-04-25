import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

app.use(cors());
app.use(express.json());

// Initialize storage
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

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// POST /api/orders - Save new order
app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;
    
    // Calculate XP
    const xp = Math.floor(order.total / 1000);
    order.xp = xp;

    // Save order
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    const orders = JSON.parse(data);
    orders.push(order);
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));

    // Update user XP
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

// GET /api/orders/:userEmail - Get orders for a specific user
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

// GET /api/users/:email - Get user XP
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

// POST /api/auth/register - Register new user
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
      password, // In a real app, hash this
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

// POST /api/auth/login - Login user
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
