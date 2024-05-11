import React, { useState } from "react";
import "./styles.css";
import AlertHandler from './AlertHandler';
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import userPool from './UserPool';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function LoginPage() {
  const [email, setEmail] = useState(''); // Initialize as empty string
  const [password, setPassword] = useState(''); // Initialize as empty string
  const [alertHandlerOpen, setAlertHandlerOpen] = useState(false);
  const [alertHandlerMessage, setAlertHandlerMessage] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

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

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        console.log("Authentication successful!", result);
        navigate("/home"); // Navigate to the home page
      },
      onFailure: (err) => {
        console.log(err.message)
        if (err.message === "User is not confirmed.") {
          setAlertHandlerMessage("email is not verified yet");
        }
        else {
          setAlertHandlerMessage(err.message);
        }
        console.error("Authentication failed:", err);
        setAlertHandlerOpen(true);
      }
    });
  };

  const handleDontHaveUserClick = () => {
    navigate("/signup"); // Navigate to create account page
  };

  const handleForgetPasswordClick = () => {
    // Implement forgot password functionality if needed
  };

  const closeAlertHandler = () => {
    setAlertHandlerOpen(false);
  };

  return (
    <div className="container">
      <AlertHandler isOpen={alertHandlerOpen} message={alertHandlerMessage} onClose={closeAlertHandler} />
      <div className="backgroundImage"></div> {/* For larger screens */}
      <div className="backgroundImageMobile"></div> {/* For smaller screens */}
      <div className="content">
        <h1 className="logo">Appartners</h1>
        <h2 className="pageName">Login</h2>
        <div className="middleFormBox">
          <p className="boxTitle">EMAIL</p>
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
          <p className="boxTitle">PASSWORD</p>
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
          <p className="smallText"> Don't have an account yet?&nbsp;&nbsp;  
            <button className="inlineButton" onClick={handleDontHaveUserClick}> Sign up</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
