import React, { useContext } from 'react';
import UserContext from './UserContext';
import logo from "./background-pictures/Logo.jpg";
import postApartment from "./background-pictures/post.png";
import findApartment from "./background-pictures/findA.png";
import findRoomate from "./background-pictures/findR.png";
import apartmentsInMyArea from "./background-pictures/map.png";
import profileImage from "./background-pictures/profilePicture.jpg";
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const Navigate = useNavigate();
  const { userEmail } = useContext(UserContext);

  const handlePostApartmentClick = () => {
    Navigate('/post apartment');
  }
  
  const handleFindApartmentClick = () => {
    Navigate('/find apartment');
  }
  
  const handleFindRoomateClick = () => {
    Navigate('/find roomate');
  }
  
  const handleApartmentsInMyAreaClick = () => {
    Navigate('/apartments in my area');
  }
  
  const handleProfileImageClick = () => {
    if (localStorage.getItem('userEmail')) {
      Navigate('/profile');
    } else {
      Navigate('/login');
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
          />
        </button>
      </div>
      <div className="content">
        <div className="logo-container">
          <img
            src={logo}
            className="logoImg"
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
              />
            </button>
            <button className="postApartment" onClick={handlePostApartmentClick}>
              <label className="label">Post Apartment
              </label>
              <img
                src={postApartment}
                className="postApartmentImg"
              />
            </button>
            <button className="findApartment" onClick={handleFindApartmentClick}>
              <p className="label">Find Apartment</p>
              <img
                src={findApartment}
                className="findApartmentImg"
              />
            </button>
            <button className="apartmentInMyArea" onClick={handleApartmentsInMyAreaClick}>
              <p className="label">Apartments in my area</p>
              <img
                src={apartmentsInMyArea}
                className="apartmentInMyAreaImg"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
