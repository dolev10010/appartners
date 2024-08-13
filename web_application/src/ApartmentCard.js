import React from 'react';
import './styles.css';

const ApartmentCard = ({ apartment }) => {
  return (
    <div className="apartment-card">
      <img src={apartment.photo_url} alt="Apartment" className="apartment-image" />
      <div className="apartment-details">
        <h3>{apartment.city}, {apartment.street}</h3>
        <p>{apartment.description}</p>
        <p>${apartment.price}</p>
      </div>
    </div>
  );
};

export default ApartmentCard;
