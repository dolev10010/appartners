import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from "./HomePage";
import CreateAccountPage from "./CreateAccountPage";
import LoginPage from "./LoginPage";
import EntryPage from "./EntryPage";
import PostApartmentPage from "./PostApartmentPage";
import ApartmentsInMyAreaPage from "./ApartmentsInMyAreaPage";
import userpool from './UserPool';
import CreateProfilePage from './ProfilePage';
import FindRoommatePage from "./FindRoommatePage";
import DisplayProfile from "./DisplayProfile";
import ChatConversationsPage from "./ChatConversationsPage";
import ChatConversationPage from "./ChatConversationPage";
import ShowApartments from "./ShowApartments";
import ApartmentDetails from "./ApartmentDetails";
import "./styles.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      let user = userpool.getCurrentUser();
      if (user) {
        console.log(user);
        setIsLoggedIn(true);
      }
    };
    checkUser();
  }, []);

  const handleContinueAsGuest = () => {
    localStorage.removeItem('profileImage'); // Remove cached profile image
    setIsLoggedIn(false); // Set guest mode
  };

  return (
    <Router>
      <Routes>
        <Route path="*" element={<EntryPage onContinueAsGuest={handleContinueAsGuest} />} />
        <Route path="/signup" element={<CreateAccountPage />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/chat" element={<ChatConversationsPage />} />
        <Route path="/chat/:receiverEmail" element={<ChatConversationPage />} />
        {isLoggedIn ? <Route path="/profile" element={<CreateProfilePage />} /> : <Route path="/login" element={<LoginPage />} />}
        {/* Conditional Routes */}
        {isLoggedIn ? (
          <>
            <Route path="/post-apartment" element={<PostApartmentPage />} />
            <Route path="/profile" element={<CreateProfilePage />} />
          </>
        ) : (
          <>
            <Route path="/post-apartment" element={<Navigate to="/homepage" />} />
            <Route path="/profile" element={<Navigate to="/login" />} />
          </>
        )}
        <Route path="/find-roomate" element={<FindRoommatePage />} />
        <Route path="/find-apartment" element={<ShowApartments />} />
        <Route path="/apartments-in-my-area" element={<ApartmentsInMyAreaPage />} />
        <Route path="/apartment-details/:id" element={<ApartmentDetails />} />
        <Route path="/profile/:email" element={<DisplayProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
