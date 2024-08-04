import React, { useState, useEffect } from "react";
import "./styles.css";
import config from './config.json';

function FindApartmentPage() {
  const [city, setCity] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await fetch(`http://${config.serverPublicIP}:5433/find-apartments?city=${city}&max_price=${maxPrice}`);
        const data = await response.json();
        setApartments(data);
      } catch (error) {
        console.error('Error fetching apartments:', error);
      }
    };

    if (city || maxPrice) {
      fetchApartments();
    }
  }, [city, maxPrice]);

  return (
    <div className="container">
      <div className="backgroundImage"></div>
      <div className="backgroundImageMobile"></div>
      <div className="content">
        <h1 className="logo">Appartners</h1>
        <h2 className="pageName">Find Apartment</h2>
        <div className="middleFormBox">
          <p className="boxTitle">City</p>
          <div className="formBoxes">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              className="input"
            />
          </div>
          <p className="boxTitle">Max Price</p>
          <div className="formBoxes">
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Enter max price"
              className="input"
            />
          </div>
          <button className="buttons" onClick={() => {}}>Search</button>
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
    </div>
  );
}

export default FindApartmentPage;
