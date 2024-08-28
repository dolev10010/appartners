import React, { useEffect, useState } from 'react';
import config from './config.json';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import MessageIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import logo from "./background-pictures/Logo.jpg";

function FindRoommatePage() {
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

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

  const handleHomeClick = () => {
    navigate('/homepage');
  };

  const handleProfileClick = (email) => {
    navigate(`/profile/${email}`);
  };

  return (
    <div className="find-roommate-page">
      <header className="header">
        <div className="logo-container">
          <img src={logo} className="logoImg" alt="Appartners Logo" />
          <h1 className="logo">Appartners</h1>
        </div>
        <h2 className="page-title">Find Roommate</h2>
      </header>

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
              subtitle={`${profile.age}, ${profile.profession}`} // Display only age and profession
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
                    onClick={() => alert('Open Chat')}
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
