import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AlertMessage from '../../../components/AlertMessage/AlertMessage';

import '../styles/loginContainer.css'
import '../../../components/inputFields.css'
import '../../../components/button.css'
import '../../../components/checkBox.css'

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmployee, setIsEmployee] = useState(false);
  const [employeeCode, setEmployeeCode] = useState('');

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
      showMessage('Please fill in all required fields.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showMessage('Passwords do not match.', 'error');
      setConfirmPassword('');
      setPassword('');
      return;
    }

    if (password.length < 8) {
      showMessage("Password must be at least 8 characters long.", 'error');
      setConfirmPassword('');
      setPassword('');
      return;
    }

    if (isEmployee && !employeeCode) {
      show('Please enter your employee code.', 'error');
      return;
    }

    const dataToSend = {
      email,          
      username,         
      first_name: firstName,  
      last_name: lastName,    
      password,
      is_employee: isEmployee,
      ...(isEmployee && { verification_code: employeeCode }),
    };


    try {
        const response = await axios.post('http://localhost:8000/api/users/create/', dataToSend);
        showMessage('Registration successful!', 'success');
        setTimeout(() => navigate('/login'), 1000);
        console.log(response.data);
      } catch (error) {
        console.error(error);

        if (error.response && error.response.data) {
          const data = error.response.data;
          const firstErrorKey = Object.keys(data)[0];
          const firstErrorMessage = Array.isArray(data[firstErrorKey])
            ? data[firstErrorKey][0]
            : data[firstErrorKey];
          if (firstErrorKey === 'email' && firstErrorMessage.includes('already exists')) {
            showMessage('User with this email is already registered.', 'error');
          } else {
            showMessage(firstErrorMessage, 'error');
          }
        } else {
          showMessage('Registration failed. Please try again.', 'error');
        }
      }
  };

  return (
    <div className="login-container">

      {message && (
        <div className="mb-4">
          <AlertMessage message={message} type={messageType} onClose={() => setMessage('')} />
        </div>
      )}

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