import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from "./HomePage";
import CreateAccountPage from "./CreateAccountPage";
import LoginPage from "./LoginPage";
import EntryPage from "./EntryPage";
import userpool from './UserPool';
import "./styles.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      let user = userpool.getCurrentUser();
      if (user) {
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
        {isLoggedIn ? <Route path="/homepage" element={<HomePage />} /> : null}
      </Routes>
    </Router>
  );
}

export default App;
