import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './navbar.css';

export default function Navbar({ token, isEmployee }) {
  const navigate = useNavigate();
  const location = useLocation();

  let role = 'guest';
  if (token) role = isEmployee ? 'employee' : 'customer';

  useEffect(() => {
    document.body.style.overflow = '';
    const checkbox = document.querySelector('.checkbox');
    if (checkbox) checkbox.checked = false;
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('is_employee');
    navigate('/login');
  };

  return (
    <nav>
      <div className="navbar">
        <div className="container nav-container">
          <input
            className="checkbox"
            type="checkbox"
            id={`checkbox-${role}`}
            onChange={(e) => {
              if (e.target.checked) {
                document.body.style.overflow = 'hidden'; 
              } else {
                document.body.style.overflow = '';         
              }
            }}
          />

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
                <li><Link to="/panel">Panel</Link></li>
                <li><Link to="/shopping-list">Shopping List</Link></li>
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
