import React from 'react';
import { Link } from 'react-router-dom';
import './styles/navbar.css'
import './styles/productsList.css'
import ProductList from './ProductsList';
import Navbar from './Navbar'

export default function CustomerHome({ username }) {
  const token = localStorage.getItem('token');
  const isEmployee = localStorage.getItem('isEmployee') === 'true';
  return (
    <div>
      <Navbar token={token} isEmployee={isEmployee} />
      <ProductList />
    </div>
  );
}
