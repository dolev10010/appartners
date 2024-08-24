import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext';
import profileImagePlaceholder from './background-pictures/profilePicture.jpg';
import config from './config.json';
import AWS from 'aws-sdk';

const UserButton = () => {
  const navigate = useNavigate();
  const { userEmail } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(profileImagePlaceholder);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (userEmail) {
        try {
          const response = await fetch(`http://${config.serverPublicIP}:5433/get-profile?email=${userEmail}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.photo_url) {
              setProfileImage(data.photo_url);
            } else {
              setProfileImage(profileImagePlaceholder);
            }
          } else {
            console.error('Failed to fetch profile image');
          }
        } catch (error) {
          console.error('Error fetching profile image:', error);
        }
      }
    };

    fetchProfileImage();
  }, [userEmail]);

  const handleProfileImageClick = () => {
    if (userEmail) {
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
