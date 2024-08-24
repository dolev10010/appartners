// HeaderButtons.js
import React from 'react';
import UserButton from './UserButton';
import HomeButton from './HomeButton';
import ChatButton from './ChatButton';
import BackButton from './BackButton';


const HeaderButtons = ({ badgeContent }) => {
  return (
    <div className="image-container">
      <UserButton />
      <HomeButton />
      <ChatButton badgeContent={badgeContent} />
      <BackButton />
    </div>
  );
};

export default HeaderButtons;