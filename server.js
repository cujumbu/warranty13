import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// SQLite database setup
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE claims (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, name TEXT, phoneNumber TEXT, orderNumber TEXT, returnAddress TEXT, brand TEXT, problem TEXT)");
  db.run("CREATE TABLE users (email TEXT PRIMARY KEY, orderNumber TEXT, isAdmin BOOLEAN)");
  
  // Insert an admin user
  db.run("INSERT INTO users (email, orderNumber, isAdmin) VALUES (?, ?, ?)", ['admin@example.com', 'admin123', true]);
});

// API routes
app.post('/api/claims', (req, res) => {
  console.log('Received claim submission:', req.body);
  const { email, name, phoneNumber, orderNumber, returnAddress, brand, problem } = req.body;
  const stmt = db.prepare("INSERT INTO claims (email, name, phoneNumber, orderNumber, returnAddress, brand, problem) VALUES (?, ?, ?, ?, ?, ?, ?)");
  stmt.run([email, name, phoneNumber, orderNumber, returnAddress, brand, problem], function(err) {
    if (err) {
      console.error('Error inserting claim:', err);
      return res.status(500).json({ error: 'Failed to submit claim' });
    }
    console.log('Claim submitted successfully, ID:', this.lastID);
    
    // Insert user credentials
    db.run("INSERT OR REPLACE INTO users (email, orderNumber, isAdmin) VALUES (?, ?, ?)", [email, orderNumber, false], (err) => {
      if (err) {
        console.error('Error inserting user:', err);
      } else {
        console.log('User inserted successfully');
      }
    });
    
    res.json({ claimNumber: this.lastID });
  });
  stmt.finalize();
});

app.get('/api/claims', (req, res) => {
  const { email, isAdmin } = req.query;
  let query = "SELECT * FROM claims";
  let params = [];

  if (isAdmin !== 'true') {
    query += " WHERE email = ? AND orderNumber = ?";
    params.push(email, req.query.orderNumber);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching claims:', err);
      return res.status(500).json({ error: 'Failed to fetch claims' });
    }
    console.log('Claims fetched:', rows);
    res.json(rows);
  });
});

app.post('/api/login', (req, res) => {
  const { email, orderNumber } = req.body;
  console.log('Login attempt:', { email, orderNumber });
  db.get("SELECT * FROM users WHERE email = ? AND orderNumber = ?", [email, orderNumber], (err, row) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (row) {
      console.log('Login successful:', row);
      res.json({ email: row.email, isAdmin: row.isAdmin, orderNumber: row.orderNumber });
    } else {
      console.log('Login failed: Invalid credentials');
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Serve static files from the React app
const distPath = process.env.DIST_PATH || path.join(__dirname, 'dist');
console.log('Serving static files from:', distPath);
app.use(express.static(distPath));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});