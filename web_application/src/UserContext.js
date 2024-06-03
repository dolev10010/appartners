import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail);
    } else {
      localStorage.removeItem('userEmail');
    }
  }, [userEmail]);

  const clearUserEmail = () => {
    setUserEmail('');
    localStorage.removeItem('userEmail');
  };

  return (
    <UserContext.Provider value={{ userEmail, setUserEmail, clearUserEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
