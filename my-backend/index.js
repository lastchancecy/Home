require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Import PostgreSQL Pool
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(express.json());
app.use(cors());

// PostgreSQL Connection Pool
const pool = new Pool({
  host: process.env.SUPABASE_HOST,
  user: process.env.SUPABASE_USER,
  password: process.env.SUPABASE_PASSWORD,
  database: process.env.SUPABASE_DATABASE,
  port: process.env.SUPABASE_PORT || 5432,
  ssl: { rejectUnauthorized: false },
});

// Routes
app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4)',
      [firstName, lastName, email, password]
    );
    res.status(201).send('User created');
  } catch (error) {
    console.error('Error inserting user: ', error);
    res.status(500).send('Error creating user');
  }
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];

      // Return a JSON response with userId and a success message
      res.status(200).json({ userId: user.id, message: 'Sign-in successful' });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during sign-in: ', error);
    res.status(500).json({ message: 'Error during sign-in' });
  }
});



app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products: ', error);
    res.status(500).send('Error fetching products');
  }
});

app.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT firstname, lastname, email FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile: ', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

app.get('/products/:id',async (req,res) => {
  const{id} = req.params;
  try{
    const result = await pool.query(
      'SELECT name, description,image,price,available,time FROM products where id=$1',
      [id]
    );
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }catch (error) {
    console.error('Error fetching user profile: ', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

app.post('/orders', async (req, res) => {
  const { user_id, product_id, time, comments } = req.body;

  if (!user_id || !product_id || !time || comments === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Insert order into the database
    const result = await pool.query(
      'INSERT INTO orders (user_id, product_id, time, comments) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, product_id, time, comments]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/orders/pending/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 AND active = 1',
      [userId]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ hasPendingOrders: true }); // Return a JSON response
    } else {
      res.status(200).json({ hasPendingOrders: false });
    }
  } catch (error) {
    console.error('Error checking pending orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Route to get orders for a specific user
app.get('/orders/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
         o.time AS order_time, 
         p.name, 
         p.description, 
         p.image, 
         p.price 
       FROM 
         orders o
       JOIN 
         products p ON o.product_id = p.id
       WHERE 
         o.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});
app.get('/orders/active/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
         o.id,  -- Make sure the order ID is selected
         o.time AS order_time, 
         p.name, 
         p.description, 
         p.image, 
         p.price,
         p.time 
       FROM 
         orders o
       JOIN 
         products p ON o.product_id = p.id
       WHERE 
         o.user_id = $1 AND o.active = 1
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'No active orders found' });
    }
  } catch (error) {
    console.error('Error fetching active order:', error);
    res.status(500).json({ message: 'Error fetching active order' });
  }
});

app.delete('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [orderId]);

    if (result.rowCount > 0) {
      res.json({ message: 'Order deleted successfully', deletedOrder: result.rows[0] });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order' });
  }
});





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});