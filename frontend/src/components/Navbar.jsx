import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div>{/* Breadcrumbs or title could go here */}</div>
      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
        <span style={{fontSize: '0.875rem', fontWeight: 500}}>Hello, {user?.username}</span>
        <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
      </div>
    </header>
  );
};
export default Navbar;
