// UserButton.js
import React from 'react';
import profileImage from './background-pictures/profilePicture.jpg';
import { useNavigate } from 'react-router-dom';

const UserButton = () => {
  const navigate = useNavigate();

  const handleProfileImageClick = () => {
    if (localStorage.getItem('userEmail')) {
      navigate('/profile');  // Navigate to profile if logged in
    } else {
      navigate('/login');     // Navigate to login if not logged in
    }
  };

  return (
    <button className="pictureButtonProfileImageHomePage" onClick={handleProfileImageClick}>
      <img src={profileImage} className="profileImageHomePage" alt="User" />
    </button>
  );
};

export default UserButton;
