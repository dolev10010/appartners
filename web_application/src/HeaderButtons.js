// HeaderButtons.js
import React from 'react';
import UserButton from './UserButton';
import HomeButton from './HomeButton';
import ChatButton from './ChatButton';

const HeaderButtons = ({ badgeContent }) => {
  return (
    <div className="image-container">
      <UserButton />
      <HomeButton />
      <ChatButton badgeContent={badgeContent} />
    </div>
  );
};

export default HeaderButtons;
