import React, { useState, useEffect } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await fetch(`${API_URL}/items`);
    const data = await response.json();
    setItems(data);
  };

  const addItem = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
    setName('');
    setDescription('');
    fetchItems();
  };

  const deleteItem = async (id) => {
    await fetch(`${API_URL}/items/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🐳 Docker Dev Environment</h1>
      <p>Try editing the code and watch it updating in realtime</p>
      
      <form onSubmit={addItem} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Add Item</button>
      </form>

      <div>
        {items.map(item => (
          <div key={item._id} style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            marginBottom: '10px',
            borderRadius: '5px'
          }}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <button onClick={() => deleteItem(item._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;