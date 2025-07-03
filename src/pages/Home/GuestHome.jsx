import React from 'react';
import { Link } from 'react-router-dom';
import ProductList from './ProductsList';
import './styles/navbar.css'
import './styles/productsList.css'

export default function GuestHome() {
  return (
    <div>
      <nav>
        <div className="navbar">
          <div className="container nav-container">
            <input className="checkbox" type="checkbox" name="" id="" />
            <div className="hamburger-lines">
              <span className="line line1"></span>
              <span className="line line2"></span>
              <span className="line line3"></span>
            </div>
            <div className="logo">
              <h1>DamKon</h1>
            </div>
            <div className="menu-items">
              <li><Link to="/login">Sign In / Sign Up</Link></li>
              <li><Link to="/homePage">Home</Link></li>
              <li><a href="#">About us</a></li>
            </div>
          </div>
        </div>
      </nav>

      <ProductList />
    </div>
  );
}
