import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage";
import CreateAccountPage from "./CreateAccountPage";
import LoginPage from "./LoginPage";
import "./styles.css";

export default function App() {
  return (
    <div className="container">
      <div className="backgroundImage"></div> {/* For larger screens */}
      <div className="backgroundImageMobile"></div> {/* For smaller screens */}
      
      <div className="content">
        <h1 className="logo">Appartners</h1>
        
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signup" element={<CreateAccountPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </div>
    </div>
  );
}

function WelcomePage() {
  return (
    <div>
      <h2 className="welcome">WELCOME!</h2>
      <div className="middleBox">
        <Link className="formBoxes" to="/signup">Create Account</Link>
        <Link className="loginBox" to="/login">Login</Link>
        <Link className="nonBoxButton" to="/home">Continue as a guest</Link>
      </div>
    </div>
  );
}
