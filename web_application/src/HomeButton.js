// HomeButton.js
import React from 'react';
import { HiOutlineHome } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const HomeButton = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/homepage');
  };

  return (
    <button className="home-button" onClick={handleHomeClick}>
      <HiOutlineHome style={{ fontSize: '35px', color: '#162A2C' }} />
    </button>
  );
};

export default HomeButton;
