import React, { useEffect, useState } from 'react';
import './styles/productsList.css';
import AlertMessage from '../AlertMessage/AlertMessage';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetch('http://localhost:8000/api/products/product_view/')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        const initialQuantities = {};
        data.forEach((product) => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      })
      .catch((err) => console.error('Error while loading product:', err));
  }, []);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
  };

  const handleQuantityChange = (productId, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta),
    }));
  };

  const handleAddToShoppingList = (productId) => {
    const quantity = quantities[productId] || 1;

    fetch('http://localhost:8000/api/shopping/shopping-list/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({
        product: productId,   
        quantity: quantity,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Request failed');
        return res.json();
      })
      .then((data) => {
        console.log('Product added to shopping list:', data);
        showMessage(`Added ${quantity} × to shopping list!`, 'success');
      })
      .catch((err) => {
        console.error('Error:', err);
        showMessage('Failed to add product to shopping list.', 'error');
      });
  };


  return (
    <div>
    <div className="mb-4">
      {message && (
        <AlertMessage
          message={message}
          type={messageType}
          onClose={() => setMessage('')}
        />
      )}
    </div>
    <div className="product-list-rows">
      {products.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        products.map((product) => (
          <div className="product-row" key={product.id}>
            <div className="product-left">
              {product.picture && (
                <img
                  className="product-thumb"
                  src={product.picture}
                  alt={product.name}
                />
              )}
              <div className="product-details">
                <h3>{product.name}</h3>
                <p>{product.price1} PLN</p>
              </div>
            </div>

          <div className="product-actions">
            <div className="inline-quantity">
              <button onClick={() => handleQuantityChange(product.id, -1)}>-</button>
              <span>{quantities[product.id] || 1}</span>
              <button onClick={() => handleQuantityChange(product.id, 1)}>+</button>
            </div>
            <button className="add-to-list-btn" onClick={() => handleAddToShoppingList(product.id)}>Add to Shopping List</button>
          </div>

          </div>
        ))
      )}
    </div>
    </div>
  );
}
