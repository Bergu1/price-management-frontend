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
      <h2 className="shop-title">Shop</h2>
      <ProductList />
    </div>
  );
}
