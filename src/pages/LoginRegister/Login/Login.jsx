import { useState } from "react";
import { Link } from 'react-router-dom';
import '../styles/loginContainer.css'
import '../styles/InputFields.css'
import '../styles/Button.css'
import '../styles/checkBox.css'

export default function Login() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!emailOrUsername || !password) {
        alert('Please fill in all fields.');
        return;
        }

        if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
        }

        const isEmail = emailOrUsername.includes("@");
        const isLogin = emailOrUsername.length >= 3;

        if (!isEmail && !isLogin) {
            alert("Please enter a valid email or username.");
            return;
        }
    };

  return (
    <div className="login-container">

      <form onSubmit={handleSubmit} className="form">
        {/* Inspired by Uiverse.io (by micaelgomestavares), customized by me */}

        <h2>Access your account</h2>

        {/* Email or Username */}
        <div className="flex-column">
          <label>Email or Username</label>
        </div>
        <div className="inputForm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="icon">
            <path d="M4 4h16v16H4z" stroke="none" />
            <path d="M4 4l8 8l8 -8" />
          </svg>
          <input
            type="text"
            className="input"
            placeholder="Enter your Email or Username"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="flex-column">
          <label>Password</label>
        </div>
        <div className="inputForm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="icon">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <input
            type="password"
            className="input"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Remember + forgot */}
        <div className="flex-row">

        {/* Inspired by Uiverse.io (by cssbuttons-io), customized by me */}
        
        <div className="cntr">
            <input type="checkbox" id="cbx" className="hidden-xs-up cbx-input" />
            <label htmlFor="cbx" className="cbx"></label>
            <label>Remember me</label>
        </div>
          <span className="span">Forgot password?</span>
        </div>

        {/* Button */}
        <button type="submit" className="button-submit">Sign In</button>

        <p className="p">
          Don't have an account? <Link to='/register' className="span">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}