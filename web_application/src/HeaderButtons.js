// HeaderButtons.js
import React from 'react';
import UserButton from './UserButton';
import HomeButton from './HomeButton';
import ChatButton from './ChatButton';

const HeaderButtons = ({ badgeContent }) => {
  return (
    <div className="header-icons">
      <UserButton />
      <HomeButton />
      <ChatButton badgeContent={badgeContent} />
    </div>
  );
};

export default HeaderButtons;
