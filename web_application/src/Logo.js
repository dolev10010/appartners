// Logo.js
import React from 'react';
import logoImage from './background-pictures/Logo.jpg'; // Adjust the path as needed

const Logo = () => {
  return (
    <div className="logo-container">
      <img src={logoImage} className="logoImg" alt="Logo" />
      <h1 className="logo">Appartners</h1>
    </div>
  );
};

export default Logo;
