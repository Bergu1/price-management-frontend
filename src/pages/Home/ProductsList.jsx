import React, { useEffect, useState } from 'react';
import './styles/productsList.css';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/products/product_view/')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Błąd ładowania produktów:', err));
  }, []);

  return (
    <div className="product-list">
      {products.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        products.map((p) => (
          <div className="product-card" key={p.id}>
            {p.picture && (
              <img
                className="product-image"
                src={p.picture}
                alt={p.name}
              />
            )}
            <div className="product-info">
              <h3>{p.name}</h3>
              <p><strong>Country:</strong> {p.country_of_origin}</p>
              <p><strong>Price:</strong> {p.price1} zł</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
