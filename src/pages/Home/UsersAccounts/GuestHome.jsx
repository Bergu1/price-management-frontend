import React from 'react';
import { Link } from 'react-router-dom';
import '../../../components/Navbar/navbar.css'
import '../styles/productsListHomePage.css';
import ProductList from '../ProductsListHomePage';
import Navbar from '../../../components/Navbar/Navbar';

export default function GuestHome() {
  const token = localStorage.getItem('token');
  const isEmployee = localStorage.getItem('isEmployee') === 'true';
  return (
    <div>
      <Navbar token={token} isEmployee={isEmployee} />
      <ProductList />
    </div>
  );
}
