import React from 'react';
import './styles.css';
import profileImagePlaceholder from "./background-pictures/profilePicture.jpg";


const RoommateListPopup = ({ roommates, onClose, onSelectRoommate }) => {
  return (
    <div className="roommate-list-popup">
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>
      <div className="roommate-list">
        {roommates.map((roommate, index) => (
          <div
            key={index}
            className="roommate-list-item"
            onClick={() => onSelectRoommate(roommate.email, roommate.full_name, roommate.photo_url)}
          >
            <img
              src={roommate.photo_url || profileImagePlaceholder}
              alt={`Roommate ${index}`}
              className="roommate-list-avatar"
            />
            <p>{roommate.full_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoommateListPopup;
