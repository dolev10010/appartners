import React, { useState } from "react";
import "./styles.css";
import HomePage from "./HomePage";
import CreateAccountPage from "./CreateAccountPage";
import LoginPage from "./LoginPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState(null);

  const handleCreateAccountClick = () => {
    setCurrentPage("createAccount");
  };

  const handleLoginClick = () => {
    setCurrentPage("login");
  };

  const handleGuestClick = () => {
    setCurrentPage("home");
  };

  return (
    <div className="container">
      <div className="backgroundImage"></div> {/* For larger screens */}
      <div className="backgroundImageMobile"></div> {/* For smaller screens */}
      {currentPage === "home" && <HomePage />}
      {currentPage === "login" && <LoginPage setCurrentPage={setCurrentPage}/>}
      {currentPage === "createAccount" && <CreateAccountPage setCurrentPage={setCurrentPage} />}
      {!currentPage && ( // Render welcome page when no page is selected
      <div className="content">
        <h1 className="logo">Appartners</h1>
        <h2 className="welcome">WELCOME!</h2>

        <div className="middleBox">
          <button className="formBoxes" onClick={handleCreateAccountClick}>Create Account</button>
          <button className="loginBox" onClick={handleLoginClick}>Login</button>
          <button className="nonBoxButton" onClick={handleGuestClick}>Continue as a guest</button>
        </div>
      </div>
      )}
    </div>
  );
}
