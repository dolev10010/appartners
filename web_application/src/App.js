import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./HomePage";
import CreateAccountPage from "./CreateAccountPage";
import LoginPage from "./LoginPage";
import EntryPage from "./EntryPage";
import ProfilePage from "./ProfilePage";
import PostApartmentPage from "./PostApartmentPage";
import FindApartmentPage from "./FindApartmentPage";
import ApartmentsInMyAreaPage from "./ApartmentsInMyAreaPage";
import userpool from './UserPool';
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
        {isLoggedIn ? <Route path="/profile" element={<ProfilePage />} /> : <Route path="/login" element={<LoginPage />} />}
        <Route path="/post-apartment" element={<PostApartmentPage />} />
        <Route path="/find-apartment" element={<FindApartmentPage />} />
        <Route path="/apartments-in-my-area" element={<ApartmentsInMyAreaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
