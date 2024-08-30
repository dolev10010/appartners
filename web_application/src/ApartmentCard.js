import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import RoommatePopup from './RoommatePopup';
import RoommateListPopup from './RoommateListPopup'; // הוסף את השורה הזו
import apartmentPlaceholder from "./background-pictures/apartmentPlaceholder.jpg";
import profileImagePlaceholder from './background-pictures/profilePicture.jpg';
import { RiInfoI } from "react-icons/ri";
import { CiLocationArrow1 } from "react-icons/ci";
import config from './config.json';

const ApartmentCard = ({ apartment, filters, sortOrder }) => {
  const navigate = useNavigate();

  const [apartmentData, setApartmentData] = useState({
    city: '',
    street: '',
    bio: '',
    photos: [apartmentPlaceholder],
    roommates: [],
    total_rooms: 0,
    available_rooms: 0,
    appartment_size: 0,
    price: 0,
    allow_pets: false,
    has_parking: false,
    has_balcony: false,
    has_sun_water_heater: false,
    is_accessible_to_disabled: false,
    entry_date: '',
  });

  const [selectedRoommate, setSelectedRoommate] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showRoommateList, setShowRoommateList] = useState(false); // הוסף את השורה הזו
  const touchStartRef = useRef(0);

  useEffect(() => {
    if (apartment) {
      setApartmentData({
        city: apartment.city || 'Unknown city',
        street: apartment.street || 'Unknown street',
        bio: apartment.post_bio || 'No description available',
        photos: apartment.photos && apartment.photos.length > 0 ? apartment.photos : [apartmentPlaceholder],
        roommates: [],
        total_rooms: apartment.total_rooms,
        available_rooms: apartment.available_rooms,
        appartment_size: apartment.appartment_size,
        price: apartment.price,
        allow_pets: apartment.allow_pets,
        has_parking: apartment.has_parking,
        has_balcony: apartment.has_balcony,
        has_sun_water_heater: apartment.has_sun_water_heater,
        is_accessible_to_disabled: apartment.is_accessible_to_disabled,
        entry_date: apartment.entry_date,
      });

      fetchRoommateDetails(apartment.roommate_emails || []);
    }
  }, [apartment]);

  const fetchRoommateDetails = async (emails) => {
    try {
      const response = await fetch(`http://${config.serverPublicIP}:5433/get-roommate-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails }),
      });

      if (response.ok) {
        const roommates = await response.json();
        setApartmentData(prevData => ({
          ...prevData,
          roommates: roommates
        }));
        setLoading(false);
      } else {
        console.error('Failed to fetch roommate details');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching roommate details:', error);
      setLoading(false);
    }
  };

  const handleRoommateClick = (roommate) => {
    setSelectedRoommate(roommate);
  };

  const handleClosePopup = () => {
    setSelectedRoommate(null);
  };

  const handleCloseRoommateListPopup = () => {
    setShowRoommateList(false);
  };

  const handleInfoClick = () => {
    const apartmentWithRoommates = {
      ...apartment,
      roommates: apartmentData.roommates
    };
    navigate(`/apartment-details/${apartment.post_id}`, { state: { apartment: apartmentWithRoommates, filters, sortOrder } });
  };

  const handleNavigateToChat = (email) => {
    navigate(`/chat?email=${email}`);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === apartmentData.photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? apartmentData.photos.length - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!touchStartRef.current) return;
    const touchEnd = e.touches[0].clientX;
    if (touchStartRef.current - touchEnd > 50) {
      handleNextImage();
      touchStartRef.current = 0;
    } else if (touchStartRef.current - touchEnd < -50) {
      handlePrevImage();
      touchStartRef.current = 0;
    }
  };

  const handleMessageClick = () => {
    if (apartmentData.roommates.length > 1) {
      setShowRoommateList(true); // הצגת הפופ-אפ עם רשימת השותפים
    } else if (apartmentData.roommates.length === 1) {
      handleNavigateToChat(apartmentData.roommates[0].email);
    } else {
      handleNavigateToChat(apartment.email);
    }
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="apartment-card-container">
      <div className="apartment-card">
        <div
          className="photo-slider"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div className="clickable-area left" onClick={handlePrevImage}></div>
          <div className="photo-slider-images">
            {apartmentData.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Apartment ${index}`}
                className={`slide ${currentImageIndex === index ? '' : 'slide-hidden'}`}
              />
            ))}
          </div>
          <div className="clickable-area right" onClick={handleNextImage}></div>
        </div>
        <div className="progress-dots">
          {apartmentData.photos.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
        <div className="roommates">
          {apartmentData.roommates.slice(0, 3).map((roommate, index) => (
            <div key={index} className="roommate" onClick={() => handleRoommateClick(roommate)}>
              <img
                src={roommate.photo_url || profileImagePlaceholder}
                alt={`Roommate ${index}`}
                className="roommate-image"
              />
            </div>
          ))}
          {apartmentData.roommates.length > 3 && (
            <div className="extra-roommates">
              +{apartmentData.roommates.length - 3}
            </div>
          )}
        </div>
        {selectedRoommate &&
          <RoommatePopup
            roommate={selectedRoommate}
            onClose={handleClosePopup}
            onViewProfile={handleNavigateToChat} // נווט לשיחה במקום לפרופיל
          />}
        {showRoommateList && // הצגת הפופ-אפ אם יש שני שותפים או יותר
          <RoommateListPopup
            roommates={apartmentData.roommates}
            onClose={handleCloseRoommateListPopup}
            onSelectRoommate={handleNavigateToChat} // נווט לשיחה עם השותף הנבחר
          />}
      </div>
      <div className="card-actions">
        <button className="info-btn" onClick={handleInfoClick}>
          <RiInfoI />
        </button>
        <button className="message-btn" onClick={handleMessageClick}>
          <CiLocationArrow1 />
        </button>
      </div>
      <div className="apartment-card_data">
        <div className="apartment-info">
          <h3>{apartmentData.city}, {apartmentData.street}</h3>
          <p className="apartmentBio">{apartmentData.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default ApartmentCard;
