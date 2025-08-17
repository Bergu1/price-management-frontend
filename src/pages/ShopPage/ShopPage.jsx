import React from 'react';
import ProductList from './ProductList';
import Navbar from '../Home/Navbar';
import './styles/productsList.css';

export default function ShopPage() {
  const token = localStorage.getItem('token');
  const isEmployee = localStorage.getItem('isEmployee') === 'true';

  return (
    <div>
      <Navbar token={token} isEmployee={isEmployee} />
      
      <header className="shop-header">
        <h1 className="shop-title">Shop</h1>
        <p className="shop-subtitle">
          Przeglądaj produkty i dodawaj je do swojej listy zakupów
        </p>
      </header>


      <ProductList />
    </div>
  );
}
