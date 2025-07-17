import React from 'react';
import { Link } from 'react-router-dom';
import ProductList from './ProductsList';
import './styles/navbar.css'
import './styles/productsList.css'
import Navbar from './Navbar'

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
