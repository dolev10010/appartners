import React, { useContext } from 'react';
import UserContext from './UserContext';


function HomePage() {

  const { userEmail } = useContext(UserContext);

  return (
    <div>
      <h1>Home Page</h1>
      <p> welcome {userEmail}</p>
    </div>
  );
}

export default HomePage;
