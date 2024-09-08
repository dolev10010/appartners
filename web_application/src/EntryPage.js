import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import CreateAccountPage from "./CreateAccountPage";
import PostApartmentPage from "./PostApartmentPage";
import FindApartmentPage from "./FindApartmentPage";
import ApartmentsInMyAreaPage from "./ApartmentsInMyAreaPage";
import LoginPage from "./LoginPage";
import "./styles.css";
import ProfilePage from "./ProfilePage";
import Logo from "./Logo";

export default function EntryPage({ onContinueAsGuest }) {
  return (
    <div className="container">
      <div className="backgroundImage"></div> {/* For larger screens */}
      <div className="backgroundImageMobile"></div> {/* For smaller screens */}
      
      <div className="content">
        <Routes>
          <Route path="/" element={<WelcomePage onContinueAsGuest={onContinueAsGuest} />} />
          <Route path="/signup" element={<CreateAccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/post-apartment" element={<PostApartmentPage />} />
          <Route path="/find-apartment" element={<FindApartmentPage />} />
          <Route path="/apartments-in-my-area" element={<ApartmentsInMyAreaPage />} />
        </Routes>
      </div>
    </div>
  );
}

function WelcomePage({ onContinueAsGuest }) {
  return (
    <div>
      <Logo />
      <h2 className="welcome">WELCOME!</h2>
      <div className="middleBox">
        <Link className="formBoxes" to="/signup">Create Account</Link>
        <Link className="loginBox" to="/login">Login</Link>
        <button className="nonBoxButton" onClick={onContinueAsGuest}>
          <Link to="/homepage">Continue as a guest</Link>
        </button>
      </div>
    </div>
  );
}
