import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import ProductList from './ProductsListHomePage';
import '../../components/Navbar/navbar.css';
import './styles/productsListHomePage.css';

export default function Home() {
  const token = localStorage.getItem('token');
  const isEmployee = JSON.parse(localStorage.getItem('is_employee') || 'false');
  const username = localStorage.getItem('username');

  return (
    <div>
      <Navbar token={token} isEmployee={isEmployee} />
      <ProductList />
    </div>
  );
}
