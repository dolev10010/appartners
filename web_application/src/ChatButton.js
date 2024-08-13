// ChatButton.js
import React from 'react';
import { HiOutlineMail } from 'react-icons/hi';
import Badge from '@mui/material/Badge';
import { useNavigate } from 'react-router-dom';

const ChatButton = ({ badgeContent }) => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate('/messages');
  };

  return (
    <button className="mail-button" onClick={handleChatClick}>
      <Badge badgeContent={badgeContent} classes={{ badge: 'custom-badge' }}>
        <HiOutlineMail style={{ fontSize: '35px', color: '#162A2C' }} />
      </Badge>
    </button>
  );
};

export default ChatButton;
