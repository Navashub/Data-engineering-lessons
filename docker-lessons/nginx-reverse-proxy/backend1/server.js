const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/v1/users', (req, res) => {
  res.json({
    service: 'Backend 1',
    version: 'v1',
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' }
    ]
  });
});

app.get('/api/v1/status', (req, res) => {
  res.json({ 
    service: 'Backend 1', 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`🔵 Backend 1 running on port ${PORT}`);
});