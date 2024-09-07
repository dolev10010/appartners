import React, { useEffect, useState, useRef } from 'react';
import config from './config.json';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import MessageIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles.css';
import logo from "./background-pictures/Logo.jpg";
import RoomatesFilterMenu from './RoomatesFilterMenu';
import { CiFilter } from "react-icons/ci";


function FindRoommatePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState(location.state?.filters || {});
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const filterButtonRef = useRef(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const queryString = Object.keys(filters)
          .filter((key) => filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) // Only add filters with values
          .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`)
          .join('&');

        const response = await fetch(`http://${config.serverPublicIP}:5433/get-roommate-profiles?${queryString}`);
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
  }, [filters]);


  const handleFilterClick = () => {
    setShowFilterSidebar(true);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilterSidebar(false);
  };

  const handleHomeClick = () => {
    navigate('/homepage');
  };

  const handleProfileClick = (email) => {
    navigate(`/profile/${email}`, { state: { filters: filters, from: 'find-roommate' } });
  };

  const handleMessageClick = (profile) => {
    navigate(`/chat/${profile.profile_email}`, { 
      state: { 
        first_name: profile.full_name.split(" ")[0], 
        last_name: profile.full_name.split(" ")[1], 
        photo_url: profile.photo_url 
      } 
    });
};
  
  useEffect(() => {
    if (location.state?.filters) {
      setFilters(location.state.filters);
    }
  }, [location.state]);

  return (
    <div className="find-roommate-page">
      <div className="content">
        <header className="header">
          <div className="logo-container">
            <img src={logo} className="logoImg" alt="Appartners Logo" />
            <h1 className="logo">Appartners</h1>
          </div>
          <div className="formRowEdit">
            <h3 className="pageName">Find Roommate</h3>
            <div className="icon-buttons">
              <button ref={filterButtonRef} className="sortButton" onClick={handleFilterClick}>
                <CiFilter />
              </button>
            </div>
          </div>
        </header>
      </div>
      {showFilterSidebar &&
        <RoomatesFilterMenu
          onApplyFilters={handleApplyFilters}
          onClose={() => setShowFilterSidebar(false)}
          initialFilters={filters}
        />
      }

      <ImageList sx={{ width: '100%', maxWidth: '600px', margin: '0 auto' }} cols={2} gap={12}>
        {profiles.map((profile) => (
          <ImageListItem key={profile.profile_id} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
            <img
              src={profile.photo_url}
              alt={profile.full_name}
              loading="lazy"
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <ImageListItemBar
              title={profile.full_name}
              subtitle={`${profile.age}, ${profile.profession}`}
              actionIcon={
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <IconButton
                    sx={{ color: 'white', padding: '4px' }}
                    aria-label={`info about ${profile.full_name}`}
                    onClick={() => handleProfileClick(profile.profile_email)}
                  >
                    <InfoIcon style={{ fontSize: '20px' }} />
                  </IconButton>
                  <IconButton
                    sx={{ color: 'white', padding: '4px' }}
                    aria-label={`message ${profile.full_name}`}
                    onClick={() => handleMessageClick(profile)}
                  >
                    <MessageIcon style={{ fontSize: '20px' }} />
                  </IconButton>
                </div>
              }
              sx={{
                background: 'rgba(0, 0, 15, 0.65)',
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px',
                padding: '0.5px 1px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: 'auto',
                minHeight: '50px',
                overflow: 'hidden',
              }}
              titleTypographyProps={{
                variant: 'h6',
                component: 'span',
                noWrap: false,
                style: {
                  whiteSpace: 'normal',
                  textAlign: 'right',
                  width: '100%',
                  lineHeight: '1.2',
                }
              }}
              subtitleTypographyProps={{
                variant: 'body2',
                component: 'span',
                noWrap: false,
                style: {
                  whiteSpace: 'normal',
                  textAlign: 'right',
                  width: '100%',
                  lineHeight: '1.2',
                }
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
      <div className="home-button-container">
        <IconButton className="home-button" onClick={handleHomeClick}>
          <HomeIcon style={{ fontSize: '35px', color: '#162A2C' }} />
        </IconButton>
      </div>
    </div>
  );
}

export default FindRoommatePage;
