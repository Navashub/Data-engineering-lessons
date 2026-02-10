const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://mongo:27017/orders', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Order Service: Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB error:', err));

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// Routes
app.post('/orders', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    
    // Call User Service to verify user exists
    try {
      await axios.get(`http://user-service:3001/users/${userId}`);
    } catch (error) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Call Product Service to get product and check stock
    let product;
    try {
      const productRes = await axios.get(`http://product-service:3002/products/${productId}`);
      product = productRes.data;
    } catch (error) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    
    // Update product stock
    await axios.put(`http://product-service:3002/products/${productId}/stock`, { quantity });
    
    // Create order
    const order = new Order({
      userId,
      productId,
      quantity,
      totalPrice: product.price * quantity,
      status: 'completed'
    });
    
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ service: 'order-service', status: 'healthy' });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`🛒 Order Service running on port ${PORT}`);
});