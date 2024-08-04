import React, { useState, useEffect } from "react";
import "./styles.css";
import config from './config.json';

function ApartmentsInMyAreaPage() {
  const [location, setLocation] = useState('');
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    const fetchApartmentsNearby = async () => {
      try {
        const response = await fetch(`http://${config.serverPublicIP}:5433/apartments-in-my-area?location=${location}`);
        const data = await response.json();
        setApartments(data);
      } catch (error) {
        console.error('Error fetching apartments in my area:', error);
      }
    };

    if (location) {
      fetchApartmentsNearby();
    }
  }, [location]);

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(`${position.coords.latitude},${position.coords.longitude}`);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="container">
      <div className="backgroundImage"></div>
      <div className="backgroundImageMobile"></div>
      <div className="content">
        <h1 className="logo">Appartners</h1>
        <h2 className="pageName">Apartments in My Area</h2>
        <button className="buttons" onClick={handleLocation}>Find My Location</button>
        <div className="apartmentResults">
          {apartments.map(apartment => (
            <div key={apartment.id} className="apartmentItem">
              <img src={apartment.photo_url} alt="Apartment" />
              <p>{apartment.address}, {apartment.city}, {apartment.state} {apartment.zip_code}</p>
              <p>${apartment.price}</p>
              <p>{apartment.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ApartmentsInMyAreaPage;
