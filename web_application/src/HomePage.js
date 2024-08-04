import React, { useContext, useState, useEffect } from 'react';
import UserContext from './UserContext';
import logo from "./background-pictures/Logo.jpg";
import postApartment from "./background-pictures/post.png";
import findApartment from "./background-pictures/findA.png";
import findRoomate from "./background-pictures/findR.png";
import apartmentsInMyArea from "./background-pictures/map.png";
import profilePlaceholder from "./background-pictures/profilePicture.jpg";
import { useNavigate } from 'react-router-dom';
import config from './config.json';

function HomePage() {
  const navigate = useNavigate();
  const { userEmail } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(profilePlaceholder);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(`http://${config.serverPublicIP}:5433/get-profile?email=${userEmail}`);
        if (response.ok) {
          const data = await response.json();
          setProfileImage(data.photo_url || profilePlaceholder);
        } else {
          console.error('Failed to fetch profile image');
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    if (userEmail) {
      fetchProfileImage();
    }
  }, [userEmail]);

  const handlePostApartmentClick = () => {
    navigate('/post-apartment');
  }

  const handleFindApartmentClick = () => {
    navigate('/find-apartment');
  }

  const handleFindRoomateClick = () => {
    navigate('/find-roomate');
  }

  const handleApartmentsInMyAreaClick = () => {
    navigate('/apartments-in-my-area');
  }

  const handleProfileImageClick = () => {
    if (localStorage.getItem('userEmail')) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="container">
      <div className="createProfileBackground"></div> {/* For larger screens */}
      <div className="backgroundImageMobile"></div> {/* For smaller screens */}
      <div className="image-container">
        <button className="pictureButtonProfileImageHomePage" onClick={handleProfileImageClick}>
          <img
            src={profileImage}
            className="profileImageHomePage"
            alt="Profile"
            loading="lazy"
          />
        </button>
      </div>
      <div className="content">
        <div className="logo-container">
          <img
            src={logo}
            className="logoImg"
            alt="Logo"
            loading="lazy"
          />
          <h1 className="logo">Appartners</h1>
        </div>
        <h3 className="welcome">welcome {userEmail}</h3>
        <div className="middleFormBox">
          <div className="wrapper">
            <button className="findRoomate" onClick={handleFindRoomateClick}>
              <label className="label">Find Roomate</label>
              <img
                src={findRoomate}
                className="findRoomateImg"
                alt="Find Roomate"
                loading="lazy"
              />
            </button>
            <button className="postApartment" onClick={handlePostApartmentClick}>
              <label className="label">Post Apartment</label>
              <img
                src={postApartment}
                className="postApartmentImg"
                alt="Post Apartment"
                loading="lazy"
              />
            </button>
            <button className="findApartment" onClick={handleFindApartmentClick}>
              <p className="label">Find Apartment</p>
              <img
                src={findApartment}
                className="findApartmentImg"
                alt="Find Apartment"
                loading="lazy"
              />
            </button>
            <button className="apartmentInMyArea" onClick={handleApartmentsInMyAreaClick}>
              <p className="label">Apartments in my area</p>
              <img
                src={apartmentsInMyArea}
                className="apartmentInMyAreaImg"
                alt="Apartments in my area"
                loading="lazy"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
