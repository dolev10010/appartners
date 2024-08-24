import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ApartmentsInMyAreaPage.css';
import config from './config.json';

function ApartmentsInMyAreaPage() {
  const [city, setCity] = useState('');
  const [citySelected, setCitySelected] = useState(false);
  const mapRef = useRef(null); // Use ref to hold the map instance
  const markersRef = useRef([]); // Use ref to hold the markers
  const userMarkerRef = useRef(null); // Use ref to hold the user location marker

  // Function to update the map center to a given location
  const updateMapCenter = useCallback((location) => {
    if (mapRef.current) {
      mapRef.current.setCenter(location);
      mapRef.current.setZoom(12); // Adjust the zoom level for a city view
    }
  }, []);

  // Fetch apartments by city and place markers on the map
  const fetchApartmentsByCity = useCallback(async () => {
    try {
      const response = await fetch(`http://${config.serverPublicIP}:5433/apartments-by-city?city=${city}`);
      const data = await response.json();

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = []; // Clear marker state

      // Place new markers
      const newMarkers = data.map(apartment => {
        const lat = parseFloat(apartment[29]);
        const lng = parseFloat(apartment[30]);

        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapRef.current,
            title: apartment[3], // Assuming address/street is in index 3
          });

          marker.addListener('click', () => {
            const infoWindow = new window.google.maps.InfoWindow({
              content: `<div>
                        <h3>${apartment[3]}</h3>
                        <p>Price: ${apartment[10]}</p>
                        <p>Rooms: ${apartment[6]}</p>
                        </div>`,
            });
            infoWindow.open(mapRef.current, marker);
          });

          return marker;
        } else {
          console.error('Invalid latitude or longitude for apartment:', apartment);
          return null;
        }
      }).filter(marker => marker !== null);

      markersRef.current = newMarkers;
    } catch (error) {
      console.error('Error fetching apartments by city:', error);
    }
  }, [city]);

  // Initialize the Google Places Autocomplete
  useEffect(() => {
    const initAutocomplete = () => {
      const input = document.getElementById('city-input');
      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        types: ['(cities)'],
        componentRestrictions: { country: 'il' }, // Restrict to Israel
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setCity(place.name);
          setCitySelected(true);
        } else {
          console.error('Place has no geometry');
        }
      });
    };

    if (window.google && window.google.maps) {
      initAutocomplete();
    }
  }, []);

  const handleSearchByCity = () => {
    if (citySelected) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: city }, (results, status) => {
        if (status === 'OK' && results[0].geometry) {
          const cityLocation = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          updateMapCenter(cityLocation); // Update map center to the searched city
          fetchApartmentsByCity(); // Fetch apartments by city and place markers
        }
      });
    } else {
      console.warn('City not selected from the list');
    }
  };

  // Get user's current location and display their city on the map when the page loads
  useEffect(() => {
    const loadUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenterToUserCity(userLocation);
        });
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    const setMapCenterToUserCity = (location) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const cityResult = results.find(result => result.types.includes('locality'));
          if (cityResult) {
            setCity(cityResult.formatted_address.split(',')[0]);
            updateMapCenter(location);
          }
        }
      });
    };

    const initMap = () => {
      if (!mapRef.current) {
        mapRef.current = new window.google.maps.Map(document.getElementById('map'), {
          center: { lat: 32.0853, lng: 34.7818 }, // Default to Tel Aviv
          zoom: 12,
          mapTypeControl: false,
          zoomControl: true,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true, // Enable fullscreen control
        });

        // Add geolocation control button
        const locationButton = document.createElement('button');
        locationButton.textContent = 'My Location';
        locationButton.classList.add('custom-map-control-button');
        mapRef.current.controls[window.google.maps.ControlPosition.LEFT_BOTTOM].push(locationButton);

        // Handle location button click
        locationButton.addEventListener('click', () => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };

              updateMapCenter(userLocation); // Center the map on user's current location

              // Add or update the user location marker
              if (userMarkerRef.current) {
                userMarkerRef.current.setPosition(userLocation);
              } else {
                userMarkerRef.current = new window.google.maps.Marker({
                  position: userLocation,
                  map: mapRef.current,
                  title: 'Your Location',
                });
              }
            });
          } else {
            console.error('Geolocation is not supported by this browser.');
          }
        });

        loadUserLocation(); // Load user location after map is initialized
      }
    };

    if (window.google && window.google.maps) {
      initMap();
    }
  }, [updateMapCenter]);

  return (
    <div className="apartments-container">
      <div className="backgroundImage"></div>
      <div className="backgroundImageMobile"></div>
      <div className="apartments-content">
        <h1 className="logo">Appartners</h1>
        <h2 className="pageName">Apartments in My Area</h2>
        <div className="apartments-searchBox">
          <input
            id="city-input"
            type="text"
            placeholder="Enter city"
            className="apartments-searchInput"
            onChange={() => setCitySelected(false)} // Reset city selection if user types manually
          />
          <button
            className="apartments-buttons"
            onClick={handleSearchByCity}
            disabled={!citySelected} // Disable button if city is not selected from the list
          >
            Search by City
          </button>
        </div>
        <div id="map" style={{ height: '500px', width: '100%' }}></div>
      </div>
    </div>
  );
}

export default ApartmentsInMyAreaPage;
