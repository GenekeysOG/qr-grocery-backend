import React, { useEffect, useState } from 'react';

const Admin = () => {
  const [carts, setCarts] = useState([]);

  const fetchCarts = async () => {
    const res = await fetch('https://qr-grocery-backend.onrender.com/admin/carts');
    const data = await res.json();
    setCarts(data);
  };

  const handleAction = async (id, action) => {
    await fetch(`https://qr-grocery-backend.onrender.com/admin/cart/${id}/${action}`, { method: 'POST' });
    fetchCarts();
  };

  useEffect(() => { fetchCarts(); }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel</h2>
      {carts.length === 0 ? <p>No pending carts.</p> : (
        <ul>
          {carts.map(cart => (
            <li key={cart.id}>
              <strong>ID:</strong> {cart.id}
              <ul>
                {cart.items.map((item, idx) => (
                  <li key={idx}>{item.Item} - ${item.Latest_Price}</li>
                ))}
              </ul>
              <button onClick={() => handleAction(cart.id, 'approve')}>✅ Approve</button>
              <button onClick={() => handleAction(cart.id, 'deny')} style={{ marginLeft: 10 }}>❌ Deny</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Admin;
