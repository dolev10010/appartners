import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./HomePage";
import CreateAccountPage from "./CreateAccountPage";
import LoginPage from "./LoginPage";
import EntryPage from "./EntryPage";
import PostApartmentPage from "./PostApartmentPage";
import FindApartmentPage from "./FindApartmentPage";
import ApartmentsInMyAreaPage from "./ApartmentsInMyAreaPage";
import userpool from './UserPool';
import CreateProfilePage from './ProfilePage';
import FindRoommatePage from "./FindRoommatePage";
import DisplayProfile from "./DisplayProfile";
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

  return (
    <Router>
      <Routes>
        <Route path="*" element={<EntryPage />} />
        <Route path="/signup" element={<CreateAccountPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/homepage" element={<HomePage />} />
        {isLoggedIn ? <Route path="/profile" element={<CreateProfilePage />} /> : <Route path="/login" element={<LoginPage />} />}
        <Route path="/find-roomate" element={<FindRoommatePage />} />
        <Route path="/post-apartment" element={<PostApartmentPage />} />
        <Route path="/find-apartment" element={<FindApartmentPage />} />
        <Route path="/apartments-in-my-area" element={<ApartmentsInMyAreaPage />} />
        <Route path="/profile/:email" element={<DisplayProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
