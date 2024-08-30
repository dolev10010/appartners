import React from 'react';
import './ApartmentDetailsPopup.css';
import { useNavigate } from 'react-router-dom';

const ApartmentDetailsPopup = ({ apartments, onClose }) => {
  const navigate = useNavigate();

  const handleDetailsClick = (apartment) => {
    navigate(`/apartment-details/${apartment.post_id}`, { state: { apartment } });
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
            <button className="details-button" onClick={() => handleDetailsClick(apartment)}>Details</button>
            {index < apartments.length - 1 && <hr />} {/* Separator between apartments */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApartmentDetailsPopup;
