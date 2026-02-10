const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// IMPORTANT: Don't use express.json() before proxy middleware
// The proxy needs to handle the raw body

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'api-gateway', status: 'healthy' });
});

// Proxy options with timeout settings
const proxyOptions = {
  changeOrigin: true,
  timeout: 30000, // 30 seconds
  proxyTimeout: 30000,
  logLevel: 'debug'
};

// Route to User Service
app.use('/api/users', createProxyMiddleware({
  target: 'http://user-service:3001',
  pathRewrite: { '^/api/users': '' },
  ...proxyOptions
}));

// Route to Product Service
app.use('/api/products', createProxyMiddleware({
  target: 'http://product-service:3002',
  pathRewrite: { '^/api/products': '' },
  ...proxyOptions
}));

// Route to Order Service
app.use('/api/orders', createProxyMiddleware({
  target: 'http://order-service:3003',
  pathRewrite: { '^/api/orders': '' },
  ...proxyOptions
}));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🌐 API Gateway running on port ${PORT}`);
  console.log(`Routes:
    - /api/users -> User Service
    - /api/products -> Product Service
    - /api/orders -> Order Service
  `);
});