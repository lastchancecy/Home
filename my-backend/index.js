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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});