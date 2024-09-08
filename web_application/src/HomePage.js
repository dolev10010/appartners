import React, { useContext, useState, useEffect } from 'react';
import UserContext from './UserContext';
import UserButton from './UserButton';
import ChatButton from './ChatButton';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';
import config from './config.json';
import profilePlaceholder from "./background-pictures/profilePicture.jpg";
import postApartment from "./background-pictures/post.png";
import findApartment from "./background-pictures/findA.png";
import findRoomate from "./background-pictures/findR.png";
import apartmentsInMyArea from "./background-pictures/map.png";

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
    // Clear session storage to reset the map page state
    sessionStorage.removeItem('city');
    sessionStorage.removeItem('citySelected');
    sessionStorage.removeItem('mapCenter');
    sessionStorage.removeItem('mapZoom');
    sessionStorage.removeItem('markers');
    sessionStorage.removeItem('selectedApartments');
    
    navigate('/apartments-in-my-area');
  }
  
  return (
    <div className="container">
      <div className="createProfileBackground"></div> {/* For larger screens */}
      <div className="backgroundImageMobile"></div> {/* For smaller screens */}
      <div className="image-container">
        <UserButton profileImage={profileImage} />
        <ChatButton badgeContent={0}/> {/* Pass the total unread count */}
      </div>
      <div className="content">
        <Logo />
        <h3 className="welcome">Welcome {userEmail}</h3>
        <div className="middleFormBox">
          <div className="wrapper">
            <button className="findRoomate" onClick={handleFindRoomateClick}>
              <label className="label">Find Roommate</label>
              <img
                src={findRoomate}
                className="findRoomateImg"
                alt="Find Roommate"
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
              <p className="label">Apartments in My Area</p>
              <img
                src={apartmentsInMyArea}
                className="apartmentInMyAreaImg"
                alt="Apartments in My Area"
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
