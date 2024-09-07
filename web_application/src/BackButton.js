import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ onClick }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    const fromPopup = sessionStorage.getItem('fromPopup'); // Check if user came from the popup

    if (fromPopup === 'true') {
      sessionStorage.removeItem('fromPopup'); // Clear the flag
      navigate(-1); // Return to map (previous page)
    } else if (onClick) {
      onClick(); // Use custom function if passed
    } else {
      navigate(-1); // Default behavior
    }
  };

  return (
    <button className="back-button" onClick={handleBackClick}>
      <IoIosArrowBack style={{ fontSize: '35px', color: '#162A2C' }} />
    </button>
  );
};

export default BackButton;
