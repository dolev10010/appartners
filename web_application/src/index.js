import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './UserContext';
import config from './config.json'; // Import your config.json

const loadGoogleMapsScript = (callback) => {
  const existingScript = document.getElementById('googleMaps');

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googlePlaces.apiKey}&libraries=places&language=en`;
    script.id = 'googleMaps';
    script.async = true; // Load the script asynchronously
    script.defer = true; // Defer script execution until after the page has loaded
    document.body.appendChild(script);

    script.onload = () => {
      if (callback) callback();
    };
  } else {
    if (callback) callback();
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));

loadGoogleMapsScript(() => {
  root.render(
    <React.StrictMode>
      <UserProvider>
        <App />
      </UserProvider>
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
