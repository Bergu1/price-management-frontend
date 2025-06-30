import { useState } from "react";
import { Link } from 'react-router-dom';
import '../styles/loginContainer.css'
import '../styles/InputFields.css'
import '../styles/Button.css'
import '../styles/checkBox.css'

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmployee, setIsEmployee] = useState(false);
  const [employeeCode, setEmployeeCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
      alert('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (isEmployee && !employeeCode) {
      alert('Please enter your employee code.');
      return;
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="form">

        {/* Inspired by Uiverse.io (by micaelgomestavares), customized by me */}

        <h2>Create your account</h2>

        {/* First Name */}
        <div className="flex-column">
          <label>First Name</label>
        </div>
        <div className="inputForm">
          <input
            type="text"
            className="input"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        {/* Last Name */}
        <div className="flex-column">
          <label>Last Name</label>
        </div>
        <div className="inputForm">
          <input
            type="text"
            className="input"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="flex-column">
          <label>Email</label>
        </div>
        <div className="inputForm">
          <input
            type="email"
            className="input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Username */}
        <div className="flex-column">
          <label>Username</label>
        </div>
        <div className="inputForm">
          <input
            type="text"
            className="input"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="flex-column">
          <label>Password</label>
        </div>
        <div className="inputForm">
          <input
            type="password"
            className="input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password */}
        <div className="flex-column">
          <label>Confirm Password</label>
        </div>
        <div className="inputForm">
          <input
            type="password"
            className="input"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Checkbox: Are you an employee? */}
        {/* Inspired by Uiverse.io (by cssbuttons-io), customized by me */}

        <div className="flex-row">
          <div className="cntr">
            <input
              type="checkbox"
              id="isEmployee"
              className="hidden-xs-up cbx-input"
              checked={isEmployee}
              onChange={() => setIsEmployee(!isEmployee)}
            />
            <label htmlFor="isEmployee" className="cbx"></label>
            <label htmlFor="isEmployee">Are you an employee?</label>
          </div>
        </div>

        {/* Conditional: Employee Code */}
        {isEmployee && (
          <>
            <div className="flex-column">
              <label>Employee Code</label>
            </div>
            <div className="inputForm">
              <input
                type="text"
                className="input"
                placeholder="Enter your employee code"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
              />
            </div>
          </>
        )}

        <button type="submit" className="button-submit">Register</button>
        <p className="p">Already have an account? <Link to='/login' className="span">Login</Link></p>
      </form>
    </div>
  );
}