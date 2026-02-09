const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('<h1>Hello from Docker! 🐳</h1><p>This app is running in a container.</p>');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});