import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ onClick }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onClick) {
      onClick(); // השתמש בפונקציה המותאמת אישית אם הועברה
    } else {
      navigate(-1); // חזרה לדף הקודם כברירת מחדל
    }
  };

  return (
    <button className="back-button" onClick={handleBackClick}>
      <IoIosArrowBack style={{ fontSize: '35px', color: '#162A2C' }} />
    </button>
  );
};

export default BackButton;
