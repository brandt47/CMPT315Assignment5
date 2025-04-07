import React from 'react';
import { Link } from 'react-router-dom';

// Basic styling (can be improved later)
const navStyle: React.CSSProperties = {
  background: '#f0f0f0',
  padding: '10px',
  marginBottom: '20px',
};

const linkStyle: React.CSSProperties = {
  marginRight: '15px',
  textDecoration: 'none',
  color: '#333',
  fontWeight: 'bold',
};

const NavigationBar: React.FC = () => {
  return (
    <nav style={navStyle}>
      <Link to="/dashboard" style={linkStyle}>
        Dashboard
      </Link>
      <Link to="/orders" style={linkStyle}>
        Orders
      </Link>
    </nav>
  );
};

export default NavigationBar; 