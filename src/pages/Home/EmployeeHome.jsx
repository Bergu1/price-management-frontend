import React from 'react';
import { Link } from 'react-router-dom';
import './styles/navbar.css'
import './styles/productsList.css'
import ProductList from './ProductsList';

export default function EmployeeHome({ username }) {
  return (
    <div>
      <nav>
        <div class="navbar">
            <div class="container nav-container">
                <input class="checkbox" type="checkbox" name="" id="" />
                <div class="hamburger-lines">
                <span class="line line1"></span>
                <span class="line line2"></span>
                <span class="line line3"></span>
                </div>  
            <div class="logo">
                <h1>DamKon</h1>
            </div>
            <div class="menu-items">
                <li><Link to ='/homePage'>Home</Link></li>
                <li><a href="#">Shop</a></li>
                <li><a href="#">Panel</a></li>
                <li><a href="#">Shopping List</a></li>
                <li><a href="#">Settings</a></li>
                <li><a href="#">About us</a></li>
            </div>
            </div>
        </div>
        </nav>
        <ProductList />
  </div>
  );
}
