import React, { useState, useEffect } from 'react';
import './ApartmentDetailsPopup.css';
import profileImagePlaceholder from './background-pictures/profilePicture.jpg'; // Placeholder for roommate photos
import { useNavigate } from 'react-router-dom';
import config from './config.json';

const ApartmentDetailsPopup = ({ apartments, onClose }) => {
  const navigate = useNavigate();
  const [selectedRoommate, setSelectedRoommate] = useState(null);

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
        return roommates;
      } else {
        console.error('Failed to fetch roommate details');
        return [];
      }
    } catch (error) {
      console.error('Error fetching roommate details:', error);
      return [];
    }
  };

  const handleDetailsClick = async (apartment) => {
    const roommateEmails = apartment.roommate_emails || [];
    const roommates = roommateEmails.length > 0 ? await fetchRoommateDetails(roommateEmails) : [];
    const apartmentWithRoommates = { ...apartment, roommates };

    sessionStorage.setItem('fromPopup', 'true'); // Set a flag in sessionStorage
    navigate(`/apartment-details/${apartment.post_id}`, { state: { apartment: apartmentWithRoommates } });
  };

  const handleRoommateClick = (roommate) => {
    setSelectedRoommate(roommate);
  };

  // Assuming all apartments in this popup share the same street, city, and number
  const { street, number, city } = apartments[0];

  return (
    <div className="apartment-details-popup-overlay">
      <div className="apartment-details-popup">
        <button className="popup-close-button" onClick={onClose}>X</button>

        <h2 className="popup-title">
          {street} {number} - {city}
        </h2>

        {apartments.map((apartment, index) => (
          <div key={index} className="apartment-details-section">
            {apartment.end_date && (
              <div className="sublet-banner">
                Sublet
              </div>
            )}
            <p className="popup-text"><strong>Price:</strong> {apartment.price} ILS</p>
            <p className="popup-text"><strong>Rooms:</strong> {apartment.total_rooms}</p>
            <p className="popup-text"><strong>Available Rooms:</strong> {apartment.available_rooms}</p>
            <p className="popup-text"><strong>Entry Date:</strong> {new Date(apartment.entry_date).toLocaleDateString()}</p>
            {apartment.end_date && (
              <p className="popup-text"><strong>End Date:</strong> {new Date(apartment.end_date).toLocaleDateString()}</p>
            )}

            {/* Display Roommates */}
            <div className="roommates">
              {apartment.roommates && apartment.roommates.slice(0, 3).map((roommate, index) => (
                <div key={index} className="roommate" onClick={() => handleRoommateClick(roommate)}>
                  <img
                    src={roommate.photo_url || profileImagePlaceholder}
                    alt={`Roommate ${index}`}
                    className="roommate-image"
                  />
                </div>
              ))}
              {apartment.roommates && apartment.roommates.length > 3 && (
                <div className="extra-roommates">
                  +{apartment.roommates.length - 3}
                </div>
              )}
            </div>

            <button className="details-button" onClick={() => handleDetailsClick(apartment)}>Details</button>
            {index < apartments.length - 1 && <hr />} {/* Separator between apartments */}
          </div>
        ))}

        {selectedRoommate && (
          <div className="roommate-popup">
            <h3>{selectedRoommate.full_name}</h3>
            <img src={selectedRoommate.photo_url || profileImagePlaceholder} alt={selectedRoommate.full_name} />
            <p>{selectedRoommate.bio}</p>
            <button onClick={() => setSelectedRoommate(null)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApartmentDetailsPopup;
