import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext';
import profileImagePlaceholder from './background-pictures/profilePicture.jpg';
import config from './config.json';

const UserButton = () => {
  const navigate = useNavigate();
  const { userEmail } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(profileImagePlaceholder);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (userEmail) {
        const cachedImage = localStorage.getItem('profileImage'); // Check if image is in localStorage
        if (cachedImage) {
          setProfileImage(cachedImage); // Use cached image
        } else {
          try {
            const response = await fetch(`http://${config.serverPublicIP}:5433/get-profile?email=${userEmail}`);
            if (response.ok) {
              const data = await response.json();
              const imageUrl = data && data.photo_url ? data.photo_url : profileImagePlaceholder;
              setProfileImage(imageUrl); // Set profile image
              localStorage.setItem('profileImage', imageUrl); // Save image in localStorage
            } else {
              setProfileImage(profileImagePlaceholder); // Fallback to placeholder if error
            }
          } catch (error) {
            console.error('Error fetching profile image:', error);
          }
        }
      }
    };

    fetchProfileImage();

    // Listen for the custom 'profileImageUpdated' event
    const handleProfileImageUpdate = (event) => {
      setProfileImage(event.detail); // Update the profile image state
    };

    window.addEventListener('profileImageUpdated', handleProfileImageUpdate);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('profileImageUpdated', handleProfileImageUpdate);
    };
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
