import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';


export default function Navbar({ token, isEmployee }) {
  const navigate = useNavigate();
  let role = 'guest';
  if (token) role = isEmployee ? 'employee' : 'customer';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isEmployee');
    navigate('/login');
  };


  return (
    <nav>
      <div className="navbar">
        <div className="container nav-container">
          <input className="checkbox" type="checkbox" id={`checkbox-${role}`} />
          <div className="hamburger-lines">
            <span className="line line1"></span>
            <span className="line line2"></span>
            <span className="line line3"></span>
          </div>
          <div className="logo">
            <h1>DamKon</h1>
          </div>
          <div className="menu-items">
            {role === 'guest' && (
              <>
                <li><Link to="/login">Sign In / Sign Up</Link></li>
                <li><Link to="/homePage">Home</Link></li>
                <li><a href="#">About us</a></li>
              </>
            )}
            {role === 'customer' && (
              <>
                <li><Link to="/homePage">Home</Link></li>
                <li><Link to="/shopPage">Shop</Link></li>
                <li><Link to="/shopping-list">Shopping List</Link></li>
                <li><a href="#">Settings</a></li>
                <li><a href="#">About us</a></li>
              </>
            )}
            {role === 'employee' && (
              <>
                <li><Link to="/homePage">Home</Link></li>
                <li><Link to="/shopPage">Shop</Link></li>
                <li><a href="#">Panel</a></li>
                <li><a href="#">Shopping List</a></li>
                <li><a href="#">Settings</a></li>
                <li><a href="#">About us</a></li>
              </>
            )}
            {role !== 'guest' && (
              <button className="logout-button" onClick={handleLogout}>
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
