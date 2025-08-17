import React, { useEffect, useState } from 'react';
import './styles/productsList.css';
import AlertMessage from '../AlertMessage/AlertMessage';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/products/product_view/')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        const initialQuantities = {};
        data.forEach((p) => (initialQuantities[p.id] = 1));
        setQuantities(initialQuantities);
      })
      .catch((err) => console.error('Error while loading product:', err));
  }, []);

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
        Authorization: 'Token ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({ product: productId, quantity }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Request failed');
        return res.json();
      })
      .then((data) => {
        console.log('Product added to shopping list:', data);
        showMessage(`Dodano ${quantity} × do listy zakupów!`, 'success');
      })
      .catch((err) => {
        console.error('Error:', err);
        showMessage('Nie udało się dodać produktu do listy.', 'error');
      });
  };

  return (
    <div className="products-wrapper">
      {message && (
        <div className="mb-4">
          <AlertMessage
            message={message}
            type={messageType}
            onClose={() => setMessage('')}
          />
        </div>
      )}

      {products.length === 0 ? (
        <p className="loading-text">Ładowanie produktów…</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-media">
                {product.picture ? (
                  <img
                    src={product.picture}
                    alt={product.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="product-placeholder" aria-hidden="true">
                    {/* ikona/placeholder */}
                    <span>Brak zdjęcia</span>
                  </div>
                )}
              </div>

              <div className="product-body">
                <h3 className="product-title" title={product.name}>
                  {product.name}
                </h3>
                <div className="product-price">
                  {Number(product.price1).toFixed(2)} PLN
                </div>
              </div>

              <div className="product-footer">
                <div className="inline-quantity">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(product.id, -1)}
                    aria-label="Zmniejsz ilość"
                  >
                    −
                  </button>
                  <span>{quantities[product.id] || 1}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(product.id, 1)}
                    aria-label="Zwiększ ilość"
                  >
                    +
                  </button>
                </div>

                <button
                  className="add-to-list-btn"
                  onClick={() => handleAddToShoppingList(product.id)}
                >
                  Dodaj do listy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
