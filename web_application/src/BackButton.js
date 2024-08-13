// BackButton.js
import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <button className="back-button" onClick={handleBackClick}>
      <IoIosArrowBack style={{ fontSize: '35px', color: '#162A2C' }} />
    </button>
  );
};

export default BackButton;
