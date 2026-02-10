const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/v2/users', (req, res) => {
  res.json({
    service: 'Backend 2',
    version: 'v2',
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
      { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'user' }
    ]
  });
});

app.get('/api/v2/status', (req, res) => {
  res.json({ 
    service: 'Backend 2', 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    features: ['advanced-search', 'pagination']
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = 4002;
app.listen(PORT, () => {
  console.log(`🟢 Backend 2 running on port ${PORT}`);
});