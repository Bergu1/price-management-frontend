import React, { useEffect, useState } from 'react';
import './styles/shoppingList.css';
import Navbar from '../Home/Navbar';
import AlertMessage from '../AlertMessage/AlertMessage';

export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const token = localStorage.getItem('token');
  const isEmployee = localStorage.getItem('isEmployee') === 'true';

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
  };


  useEffect(() => {
    fetch('http://localhost:8000/api/shopping/shopping-list/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token,
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

    console.log(token);
  }, [token]);

  const markAsPurchased = (id) => {
    if (purchasedItems.includes(id)) {
    setPurchasedItems(purchasedItems.filter(itemId => itemId !== id));
    showMessage('Marked as not purchased', 'success');
  } else {
    setPurchasedItems([...purchasedItems, id]);
    showMessage('Marked as purchased', 'success');
  }
  };

  const removeItem = (itemId) => {
    fetch(`http://localhost:8000/api/shopping/shopping-list/${itemId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem('token'),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Request failed');
        setItems(items.filter(item => item.id !== itemId));
        showMessage('Product removed from shopping list.', 'success');
      })
      .catch((err) => {
        console.error('Error:', err);
        showMessage('Failed to remove product.', 'error');
      });
  };

  return (
    <div>
      <Navbar token={token} isEmployee={isEmployee} />
      <div className="mb-4">
      {message && (
        <AlertMessage
          message={message}
          type={messageType}
          onClose={() => setMessage('')}
        />
      )}
      </div>
      <h2 className="shop-title">Shopping List</h2>
      <div className="shopping-list">
        {items.length === 0 ? (
          <p>No items in your list.</p>
        ) : (
          <ul>
            {items.map((item) => {
              const isPurchased = purchasedItems.includes(item.id);
              return (
                <li key={item.id} className={`shopping-item ${isPurchased ? 'purchased' : ''}`}>
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
                  <div className="shopping-actions">
                    <button
                      className="purchase-btn"
                      onClick={() => markAsPurchased(item.id)}
                    >
                      ✔️
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      ❌
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
