import React, { useState } from "react";
import "./styles.css";
import AlertHandler from './AlertHandler';
import config from './config.json';

function LoginPage({ setCurrentPage }) {
  const [email, setEmail] = useState(null); // State to hold the entered email
  const [password, setPassword] = useState(null); // State to hold the entered password
  const [alertHandlerOpen, setAlertHandlerOpen] = useState(false);
  const [alertHandlerMessage, setAlertHandlerMessage] = useState(null);
  
  const handleEmailChange = (event) => {
      setEmail(event.target.value);
      };

  const handlePasswordChange = (event) => {
      setPassword(event.target.value);
      };
    
  const handleSignin = () => {
      if (!email || !password) {
        setAlertHandlerMessage("Please fill in all fields.");
        setAlertHandlerOpen(true);
        return;
      }

      console.log("Attempting to sign in with", email);
      
      // Construct the payload
      const userData = {
        email: email,
        password: password
      };
      
      
      console.log("Sending data to server:", userData);
      
      fetch(`http://${config.serverPublicIP}:5433/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      .then(response => {
        console.log("Server response:", response);
        return response.json(); // This parses the JSON body of the response object
      })
      .then(data => {
        console.log("Login response data:", data);
        if (data.errorMessage) {
          // Handle specific error messages
          if (data.errorMessage === "wrong info") {
            setAlertHandlerMessage("email or password are wrong");
            setAlertHandlerOpen(true);
            return;
          } else {
            setAlertHandlerMessage(data.errorMessage); // For other errors, display them directly
            setAlertHandlerOpen(true);
            return;
          }
        } else {
          console.log("successful login");
          setCurrentPage("home");
        }
      });
    };

  const handleDontHaveUserClick = () => {
    setCurrentPage("createAccount");
  };

  const handleForgetPasswordClick = () => {};

  const closeAlertHandler = () => {
    setAlertHandlerOpen(false);
  };
    
  return (
    <div className="container">
      <AlertHandler isOpen={alertHandlerOpen} message={alertHandlerMessage} onClose={closeAlertHandler} />
      <div className="backgroundImageNewAccount"></div> {/* For larger screens */}
      <div className="backgroundImageMobileNewAccount"></div> {/* For smaller screens */}
            <div className="content">
        <h1 className="logo">Appartners</h1>
        <h2 className="pageName">Login</h2>

            <div className="middleFormBox">
                <text className="boxTitle">EMAIL</text>
                <div className="formBoxes">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Please enter your email"
                        className="input"
                    />
                </div> 
                <text className="boxTitle">PASSWORD</text>
                <div className="formBoxes">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Please enter your password"
                        className="input"
                    />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "15px"}}>
                    <label htmlFor="staySignedInCheckbox">
                    <input type="checkbox" id="staySignedInCheckbox" />
                    Stay signed in
                    </label>
                    <button className="inlineButton" onClick={handleForgetPasswordClick}>Forgot Password</button>
                </div>
                <button className="buttons" onClick={handleSignin}>Sign in</button>
                <p className="smallText"> Don’t have account yet?   
                <button className="inlineButton" onClick={handleDontHaveUserClick}> Sign up</button>
                </p>
            </div>
        </div>
    </div>
  );
}

export default LoginPage;
