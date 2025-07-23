const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const Fuse = require('fuse.js');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const groceryData = JSON.parse(fs.readFileSync('../data/grocery_items.json', 'utf8'));
const carts = {};
const archive = {};

const fuse = new Fuse(groceryData, { keys: ['Item'], threshold: 0.4 });

app.get('/search', (req, res) => {
  const query = req.query.q || '';
  if (!query) return res.json([]);
  const results = fuse.search(query).map(result => result.item);
  res.json(results);
});

app.post('/cart', (req, res) => {
  const items = req.body.items;
  const cartId = uuidv4();
  carts[cartId] = { id: cartId, items, status: 'pending' };
  res.json({ message: 'Cart submitted for approval', cartId });
});

app.get('/admin/carts', (req, res) => {
  const pending = Object.values(carts).filter(c => c.status === 'pending');
  res.json(pending);
});

app.post('/admin/cart/:id/approve', (req, res) => {
  const id = req.params.id;
  if (!carts[id]) return res.status(404).json({ error: 'Cart not found' });
  carts[id].status = 'approved';
  res.json({ message: 'Cart approved' });
});

app.post('/admin/cart/:id/deny', (req, res) => {
  const id = req.params.id;
  if (!carts[id]) return res.status(404).json({ error: 'Cart not found' });
  carts[id].status = 'denied';
  archive[id] = carts[id];
  delete carts[id];
  res.json({ message: 'Cart denied and archived' });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
