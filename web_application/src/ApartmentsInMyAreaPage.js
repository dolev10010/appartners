import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ApartmentsInMyAreaPage.css';
import ApartmentDetailsPopup from './ApartmentDetailsPopUp';
import config from './config.json';
import Logo from "./Logo";
import HeaderButtons from "./HeaderButtons";
import "./styles.css";

function ApartmentsInMyAreaPage() {
  const [city, setCity] = useState('');
  const [citySelected, setCitySelected] = useState(false);
  const [selectedApartments, setSelectedApartments] = useState([]); // State to track selected apartments at the same location
  const [showCollegeLocation, setShowCollegeLocation] = useState(true); // Flag for showing the academic college location
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

      // Group apartments by their latitude and longitude
      const apartmentsByLocation = data.reduce((acc, apartment) => {
        const key = `${apartment.latitude}-${apartment.longitude}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(apartment);
        return acc;
      }, {});

      // Place new markers
      const newMarkers = Object.keys(apartmentsByLocation).map((key) => {
        const [lat, lng] = key.split('-').map(parseFloat);
        const apartmentsAtLocation = apartmentsByLocation[key];

        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapRef.current,
            title: apartmentsAtLocation[0].street, // Assuming street is stored in the apartment object
          });

          marker.addListener('click', () => {
            setSelectedApartments(apartmentsAtLocation); // Set the selected apartments for the popup
            sessionStorage.setItem('selectedApartments', JSON.stringify(apartmentsAtLocation)); // Save selected apartments in sessionStorage
          });

          return marker;
        } else {
          console.error('Invalid latitude or longitude for apartments:', apartmentsAtLocation);
          return null;
        }
      }).filter(marker => marker !== null);

      markersRef.current = newMarkers;

      // Store markers in sessionStorage
      sessionStorage.setItem('markers', JSON.stringify(data));
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

  // Initialize the map when the component mounts
  useEffect(() => {
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
            if (showCollegeLocation) {
              // Show the Academic College of Tel Aviv–Yaffo location
              const collegeLocation = {
                lat: 32.047487,
                lng: 34.7607544,
              };
              updateMapCenter(collegeLocation);

              if (userMarkerRef.current) {
                userMarkerRef.current.setPosition(collegeLocation);
              } else {
                userMarkerRef.current = new window.google.maps.Marker({
                  position: collegeLocation,
                  map: mapRef.current,
                  title: 'The Academic College of Tel Aviv–Yaffo',
                  icon: {
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" // Blue marker icon for the college location
                  }
                });
              }
            } else {
              // Show the user's real location
              navigator.geolocation.getCurrentPosition((position) => {
                const userLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };

                updateMapCenter(userLocation);

                if (userMarkerRef.current) {
                  userMarkerRef.current.setPosition(userLocation);
                } else {
                  userMarkerRef.current = new window.google.maps.Marker({
                    position: userLocation,
                    map: mapRef.current,
                    title: 'Your Location',
                    icon: {
                      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" // Blue marker icon for user's location
                    }
                  });
                }
              });
            }
          } else {
            console.error('Geolocation is not supported by this browser.');
          }
        });
      }
    };

    if (window.google && window.google.maps) {
      initMap();

      // Restore markers from sessionStorage
      const storedMarkers = JSON.parse(sessionStorage.getItem('markers'));
      if (storedMarkers) {
        storedMarkers.forEach(apartment => {
          const lat = parseFloat(apartment.latitude);
          const lng = parseFloat(apartment.longitude);

          if (!isNaN(lat) && !isNaN(lng)) {
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map: mapRef.current,
              title: apartment.street, // Assuming street is stored in the apartment object
            });

            marker.addListener('click', () => {
              const apartmentsAtLocation = storedMarkers.filter(
                apt => apt.latitude === apartment.latitude && apt.longitude === apartment.longitude
              );
              setSelectedApartments(apartmentsAtLocation); // Set the selected apartments for the popup
              sessionStorage.setItem('selectedApartments', JSON.stringify(apartmentsAtLocation)); // Save selected apartments in sessionStorage
            });

            markersRef.current.push(marker);
          }
        });
      }

      // Restore selected apartments for the popup
      const storedSelectedApartments = JSON.parse(sessionStorage.getItem('selectedApartments'));
      if (storedSelectedApartments) {
        setSelectedApartments(storedSelectedApartments);
      }
    }
  }, [updateMapCenter, showCollegeLocation]);

  // Restore map state when the component mounts
  useEffect(() => {
    const storedCity = sessionStorage.getItem('city');
    const storedCitySelected = sessionStorage.getItem('citySelected') === 'true';
    const storedMapCenter = JSON.parse(sessionStorage.getItem('mapCenter'));
    const storedMapZoom = sessionStorage.getItem('mapZoom');

    if (storedCity && storedCitySelected && storedMapCenter && storedMapZoom) {
      setCity(storedCity);
      setCitySelected(storedCitySelected);
      if (mapRef.current) {
        mapRef.current.setCenter(storedMapCenter);
        mapRef.current.setZoom(parseInt(storedMapZoom, 10));
      }
      fetchApartmentsByCity(); // Fetch apartments based on the stored city
    }
  }, [fetchApartmentsByCity]);

  const handleSearchByCity = () => {
    // Clear previous state from sessionStorage
    sessionStorage.removeItem('city');
    sessionStorage.removeItem('citySelected');
    sessionStorage.removeItem('mapCenter');
    sessionStorage.removeItem('mapZoom');
    sessionStorage.removeItem('markers');
    sessionStorage.removeItem('selectedApartments');

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

  return (
    <div className="apartments-container">
      <div className="backgroundImage"></div>
      <div className="backgroundImageMobile"></div>
      <div className="image-container">
        <HeaderButtons badgeContent={4} />
      </div>
      <div className='space'></div>
      <div className="content"><Logo /></div>
      <div className="apartments-content">
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
        <div id="map"></div>
      </div>

      {selectedApartments.length > 0 && (
        <ApartmentDetailsPopup 
          apartments={selectedApartments} // Pass all apartments at the same location
          onClose={() => {
            setSelectedApartments([]); // Clear selected apartments when the popup is closed
            sessionStorage.removeItem('selectedApartments'); // Remove from sessionStorage
          }} 
        />
      )}
    </div>
  );
}

export default ApartmentsInMyAreaPage;
