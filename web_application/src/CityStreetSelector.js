import React, { useState, useEffect } from 'react';

const CityStreetSelector = ({ city, street, number, floor, onCityChange, onStreetChange, onNumberChange, onFloorChange, onCoordinatesChange }) => {
  const [selectedCity, setSelectedCity] = useState(city || '');
  const [selectedStreet, setSelectedStreet] = useState(street || '');
  const [selectedNumber, setSelectedNumber] = useState(number || '');
  const [selectedFloor, setSelectedFloor] = useState(floor || '');
  const [isStreetValid, setIsStreetValid] = useState(false);
  const [streetDisabled, setStreetDisabled] = useState(!city); // Enable street editing if city exists
  const [cityCoordinates, setCityCoordinates] = useState(null); // Store city coordinates for street autocomplete

  useEffect(() => {
    // Initialize city autocomplete
    const cityAutocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById('city-autocomplete'),
      {
        types: ['(cities)'],
        componentRestrictions: { country: 'il' }
      }
    );

    cityAutocomplete.addListener('place_changed', () => {
      const place = cityAutocomplete.getPlace();
      const cityName = place.name;
      const cityCoords = place.geometry.location;
      setSelectedCity(cityName);
      onCityChange(cityName);
      setCityCoordinates(cityCoords);
      onCoordinatesChange({ lat: cityCoords.lat(), lng: cityCoords.lng() });
      setStreetDisabled(false);

      initializeStreetAutocomplete(cityCoords);
    });

    // Initialize street autocomplete if the city is already provided (for editing)
    if (city && selectedCity) {
      getCoordinatesFromAddress(city, (coords) => {
        setCityCoordinates(coords);
        initializeStreetAutocomplete(coords);
      });
    }
  }, [onCityChange, onStreetChange, onCoordinatesChange, selectedNumber, city, selectedCity]);

  const initializeStreetAutocomplete = (cityCoords) => {
    const streetInput = document.getElementById('street-autocomplete');
    const streetAutocomplete = new window.google.maps.places.Autocomplete(
      streetInput,
      {
        types: ['address'],
        componentRestrictions: { country: 'il' },
        bounds: new window.google.maps.LatLngBounds(cityCoords),
      }
    );

    streetAutocomplete.addListener('place_changed', () => {
      const streetPlace = streetAutocomplete.getPlace();
      const streetName = extractStreetName(streetPlace.address_components);
      const streetCoords = streetPlace.geometry.location;
      setSelectedStreet(streetName);
      setIsStreetValid(true);
      onStreetChange(streetName);

      // Adjust coordinates if number is entered
      if (selectedNumber) {
        const fullAddress = `${streetName} ${selectedNumber}, ${selectedCity}`;
        getCoordinatesFromAddress(fullAddress, (newCoordinates) => {
          onCoordinatesChange(newCoordinates);
        });
      } else {
        onCoordinatesChange({ lat: streetCoords.lat(), lng: streetCoords.lng() });
      }
    });
  };

  const extractStreetName = (addressComponents) => {
    for (const component of addressComponents) {
      if (component.types.includes('route')) {
        return component.long_name.replace(/ street| st| road/gi, '');
      }
    }
    return '';
  };

  const getCoordinatesFromAddress = (address, callback) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        callback({ lat: location.lat(), lng: location.lng() });
      }
    });
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);

    if (newCity !== selectedCity) {
      setSelectedStreet('');
      setIsStreetValid(false);
      onStreetChange('');
      setStreetDisabled(true);
    }
  };

  const handleStreetChange = (e) => {
    setSelectedStreet(e.target.value);
    setIsStreetValid(false);
  };

  const handleStreetBlur = () => {
    if (!isStreetValid) {
      setSelectedStreet('');
      onStreetChange('');
    }
  };

  const handleNumberChange = (e) => {
    const newNumber = e.target.value;
    setSelectedNumber(newNumber);
    onNumberChange(newNumber);

    // If the street is already selected, update coordinates with the building number
    if (selectedStreet && selectedCity) {
      const fullAddress = `${selectedStreet} ${newNumber}, ${selectedCity}`;
      getCoordinatesFromAddress(fullAddress, (newCoordinates) => {
        onCoordinatesChange(newCoordinates);
      });
    }
  };

  const handleFloorChange = (e) => {
    setSelectedFloor(e.target.value);
    onFloorChange(e.target.value);
  };

  return (
    <div>
      <div className="post-apartment-formRow">
        <div className="post-apartment-formGroup">
          <label>City</label>
          <input
            id="city-autocomplete"
            name="city"
            value={selectedCity}
            onChange={handleCityChange}
            placeholder="Enter city"
            className="post-apartment-input"
          />
        </div>
        <div className="post-apartment-formGroup">
          <label>Street</label>
          <input
            id="street-autocomplete"
            name="street"
            value={selectedStreet}
            onChange={handleStreetChange}
            onBlur={handleStreetBlur}
            placeholder={streetDisabled ? "Select a city first" : "Enter street"}
            className="post-apartment-input"
            disabled={streetDisabled}
          />
        </div>
      </div>
      <div className="post-apartment-formRow">
        <div className="post-apartment-formGroup">
          <label>Number</label>
          <input
            type="text"
            name="number"
            value={selectedNumber}
            onChange={handleNumberChange}
            className="post-apartment-input"
            placeholder="Apartment number"
          />
        </div>
        <div className="post-apartment-formGroup">
          <label>Floor</label>
          <input
            type="text"
            name="floor"
            value={selectedFloor}
            onChange={handleFloorChange}
            className="post-apartment-input"
            placeholder="Enter floor"
          />
        </div>
      </div>
    </div>
  );
};

export default CityStreetSelector;
