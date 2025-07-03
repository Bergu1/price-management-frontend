import React from 'react';
import GuestHome from './GuestHome';
import CustomerHome from './CustomerHome';
import EmployeeHome from './EmployeeHome';

export default function Home() {
  const token = localStorage.getItem('token');
  const isEmployee = localStorage.getItem('is_employee') === 'true';
  const username = localStorage.getItem('username');

  if (!token) return <GuestHome />;

  return isEmployee
    ? <EmployeeHome username={username} />
    : <CustomerHome username={username} />;
}
