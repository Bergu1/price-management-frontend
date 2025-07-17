import React, { useEffect, useState } from 'react';
import './styles/shoppingList.css';

export default function ShoppingList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
      fetch('http://localhost:8000/api/shopping/shopping-list/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + localStorage.getItem('token'),
        }
      })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch shopping list');
        return res.json();
      })
      .then((data) => setItems(data))
      .catch((err) => {
        console.error(err);
        alert('Unable to load shopping list.');
      });
            console.log(localStorage.getItem('token'));
  }, []);

  return (
    <div className="shopping-list">
      <h2>Your Shopping List</h2>
      {items.length === 0 ? (
        <p>No items in your list.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} className="shopping-item">
              {item.product && (
                <img
                  src={item.product.picture}
                  alt={item.product.name}
                  className="shopping-thumb"
                />
              )}
              <div className="shopping-info">
                <h4>{item.product.name}</h4>
                <p>Quantity: {item.quantity}</p>
                <p>Price: {parseFloat(item.product.price1).toFixed(2)} PLN</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
