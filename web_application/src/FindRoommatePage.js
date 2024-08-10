import React, { useEffect, useState } from 'react';
import config from './config.json';
import "./styles.css";

function FindRoommatePage() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(`http://${config.serverPublicIP}:5433/get-roommate-profiles`);
        if (response.ok) {
          const data = await response.json();
          setProfiles(data);
        } else {
          console.error('Failed to fetch profiles');
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div className="find-roommate-page">
      <h1>Find Roommate</h1>
      <div className="profile-list">
        {profiles.map((profile) => (
          <div key={profile.profile_id} className="profile-card">
            <img src={profile.photo_url} alt={profile.full_name} className="profile-image" />
            <div className="profile-info">
              <h2>{profile.full_name}</h2>
              <p>{profile.bio}</p>
              <button onClick={() => alert('Open Chat')}>Send Message</button>
              <button onClick={() => alert('Show Profile Info')}>i</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FindRoommatePage;
