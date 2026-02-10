const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://mongo:27017/products', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Product Service: Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB error:', err));

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema);

// Routes
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/products/:id/stock', async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    
    product.stock -= quantity;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ service: 'product-service', status: 'healthy' });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`📦 Product Service running on port ${PORT}`);
});