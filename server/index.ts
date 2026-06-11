import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db';
import bcrypt from 'bcrypt';

dotenv.config();

const ADMIN_EMAIL = "admin@mail.ru";
const ADMIN_PASSWORD = "qwerty";
const ADMIN_TOKEN = "admin-token";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      token: ADMIN_TOKEN,
      admin: { email: ADMIN_EMAIL, role: 'admin' }
    });
  }
  return res.status(401).json({ success: false, message: 'Неверный email или пароль' });
});

app.use('/api/admin', requireAdmin);

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


    for (const item of order.items) {
      const productCheck = await client.query('SELECT id FROM products WHERE id = $1', [item.id]);
      if (productCheck.rows.length === 0) {
        throw new Error(`Product with ID ${item.id} not found`);
      }
    }


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


    for (const item of order.items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.id, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');


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
    const result = await pool.query(`
      SELECT o.*, u.name as "registered_user_name", u.email as "registered_user_email"
      FROM orders o
      LEFT JOIN users u ON o.user_email = u.email
      ORDER BY o.date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {

      const result = await pool.query('SELECT * FROM orders WHERE user_email = $1 ORDER BY date DESC', [id]);
      const orders = result.rows;
      for (let order of orders) {
        const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
        order.items = itemsResult.rows;
      }
      return res.json(orders);
    }

    const orderResult = await pool.query(`
      SELECT o.*, u.name as "registered_user_name", u.email as "registered_user_email" 
      FROM orders o 
      LEFT JOIN users u ON o.user_email = u.email 
      WHERE o.id = $1
    `, [id]);
    
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

app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const [
      revenueResult,
      ordersCountResult,
      usersCountResult,
      productsCountResult,
      recentOrdersResult,
      cancelledCountResult,
      deliveredCountResult,
      deliveredRevenueResult
    ] = await Promise.all([
      pool.query("SELECT SUM(total) as revenue FROM orders WHERE status IN ('confirmed', 'shipped', 'delivered')"),
      pool.query("SELECT COUNT(*) as count FROM orders"),
      pool.query("SELECT COUNT(*) as count FROM users"),
      pool.query("SELECT COUNT(*) as count FROM products"),
      pool.query(`
        SELECT o.*, u.name as "registered_user_name" 
        FROM orders o 
        LEFT JOIN users u ON o.user_email = u.email 
        ORDER BY o.date DESC LIMIT 5
      `),
      pool.query("SELECT COUNT(*) as count FROM orders WHERE status = 'cancelled'"),
      pool.query("SELECT COUNT(*) as count FROM orders WHERE status = 'delivered'"),
      pool.query("SELECT SUM(total) as revenue FROM orders WHERE status = 'delivered'")
    ]);

    const totalRevenue = Number(revenueResult.rows[0].revenue) || 0;
    const totalOrders = Number(ordersCountResult.rows[0].count) || 0;
    const totalUsers = Number(usersCountResult.rows[0].count) || 0;
    const totalProducts = Number(productsCountResult.rows[0].count) || 0;
    const cancelledOrders = Number(cancelledCountResult.rows[0].count) || 0;
    const deliveredOrders = Number(deliveredCountResult.rows[0].count) || 0;
    const deliveredRevenue = Number(deliveredRevenueResult.rows[0].revenue) || 0;
    
    const recentOrders = recentOrdersResult.rows.map(row => {
      let customerName = "Неизвестный клиент";
      try {
        const info = typeof row.customer_info === 'string' ? JSON.parse(row.customer_info) : row.customer_info;
        if (info && info.fullName) {
          customerName = info.fullName;
        } else if (info && info.name) {
          customerName = info.name;
        } else if (row.registered_user_name) {
          customerName = row.registered_user_name;
        }
      } catch(e) {}

      return {
        id: row.id,
        orderNumber: row.order_number,
        customerName,
        total: row.total,
        status: row.status,
        date: row.date
      };
    });

    res.json({
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      cancelledOrders,
      deliveredOrders,
      deliveredRevenue,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.xp, 
        u.level,
        u.is_blocked,
        COUNT(o.id)::int as "ordersCount"
      FROM users u
      LEFT JOIN orders o ON u.email = o.user_email
      GROUP BY u.id, u.name, u.email, u.xp, u.level
      ORDER BY u.id ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ error: 'Failed to fetch admin users' });
  }
});

app.patch('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, xp, level } = req.body;
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, xp = $3, level = COALESCE($4, level) WHERE id = $5 RETURNING id, name, email, xp, level, is_blocked',
      [name, email, xp, level, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });
    res.json(result.rows[0]);
  } catch(error) { 
    console.error('Failed to update user:', error);
    res.status(500).json({ error: 'Failed to update user' }); 
  }
});

app.patch('/api/admin/users/:id/block', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE users SET is_blocked = NOT is_blocked WHERE id = $1 RETURNING id, is_blocked',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });
    res.json(result.rows[0]);
  } catch(error) { 
    console.error('Failed to toggle block status:', error);
    res.status(500).json({ error: 'Failed to toggle block status' }); 
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userResult = await pool.query('SELECT email FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });
    const userEmail = userResult.rows[0].email;

    const orderCheck = await pool.query('SELECT id FROM orders WHERE user_email = $1 LIMIT 1', [userEmail]);
    if (orderCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Нельзя удалить пользователя: существуют связанные заказы' });
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true });
  } catch(error) { 
    console.error('Failed to delete user:', error);
    res.status(500).json({ error: 'Failed to delete user' }); 
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    

    let result;
    if (id.includes('@')) {
      result = await pool.query('SELECT id, name, email, xp, level FROM users WHERE email = $1', [id]);
    } else {
      result = await pool.query('SELECT id, name, email, xp, level FROM users WHERE id = $1', [id]);
    }
    
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {

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
    }

    res.json(order);
  } catch (error) {
    console.error('Failed to cancel order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

app.patch('/api/admin/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to update order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password, xp, level) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, xp, level',
      [name, email, hashedPassword, 0, 1]
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
    
    const result = await pool.query('SELECT id, name, email, xp, level, is_blocked, password FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    if (user.is_blocked) {
      return res.status(403).json({ error: 'Аккаунт заблокирован' });
    }

    delete user.password;
    res.json(user);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
