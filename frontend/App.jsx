import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const App = () => {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState([]);
  const [cart, setCart] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!query) return setMatches([]);
    fetch(`http://localhost:3001/search?q=${query}`)
      .then(res => res.json())
      .then(setMatches);
  }, [query]);

  const addToCart = (item) => {
    setCart([...cart, item]);
    setQuery('');
    setMatches([]);
  };

  const confirmCart = async () => {
    const res = await fetch('http://localhost:3001/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart })
    });
    await res.json();
    setConfirmed(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <Link to="/admin">Go to Admin Panel</Link>
      <h2>What groceries do we need?</h2>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Type item..." />
      <ul>
        {matches.map((item, idx) => (
          <li key={idx} onClick={() => addToCart(item)} style={{ cursor: 'pointer' }}>
            {item.Item} (${item.Latest_Price})
          </li>
        ))}
      </ul>
      <h3>Cart</h3>
      <ul>
        {cart.map((item, idx) => (
          <li key={idx}>{item.Item} (${item.Latest_Price})</li>
        ))}
      </ul>
      {!confirmed && cart.length > 0 && (
        <button onClick={confirmCart}>Confirm Cart</button>
      )}
      {confirmed && <p>Cart submitted ✅</p>}
    </div>
  );
};

export default App;
