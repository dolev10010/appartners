import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  useEffect(() => {
    localStorage.setItem('userEmail', userEmail);
  }, [userEmail]); // This effect runs whenever userEmail changes

  return (
    <UserContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
