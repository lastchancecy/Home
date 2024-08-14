const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(cors());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Abc1234$',
  database: 'users_db',
});


app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`,
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
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length > 0) {
      res.status(200).send('Sign-in successful');
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (error) {
    console.error('Error during sign-in: ', error);
    res.status(500).send('Error during sign-in');
  }
});

app.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products: ', error);
    res.status(500).send('Error fetching products');
  }
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
