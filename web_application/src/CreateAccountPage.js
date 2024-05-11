import React, { useState } from "react";
import "./styles.css";
import AlertHandler from './AlertHandler';
import { useNavigate } from 'react-router-dom';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import userpool from './UserPool';

function CreateAccountPage({ setCurrentPage }) {
  const Navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(null); 
  const [alertHandlerOpen, setAlertHandlerOpen] = useState(false);
  const [alertHandlerMessage, setAlertHandlerMessage] = useState(null);
  
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
    
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const isEmailValid = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const isPasswordValid = (password) => {
    // Check for a minimum length of 8 characters
    if (password.length < 8) {
        return false
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
        return false;
    }

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return false;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        return false;
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        return false;
    }

    return true;
};

  const handleSignUp = () => {
    console.log("Attempting to sign up with", email, password, confirmPassword);
  
    if (!email || !password || !confirmPassword) {
      setAlertHandlerMessage("Please fill in all fields.");
      setAlertHandlerOpen(true);
      return;
    }

    if (!isEmailValid(email)) {
      setAlertHandlerMessage("Please enter a valid email address.");
      setAlertHandlerOpen(true);
      return;
    }

    if (!isPasswordValid(password)) {
      setAlertHandlerMessage("Password is not valid.\nrequirements:\n1. at least 1 number\n2. at least 1 special character\n3. at least 1 uppercase letter\n4. at leaset 1 lowercase letter\n5. at least length of 8 characters");
      setAlertHandlerOpen(true);
      return;
    }

  
    if (password !== confirmPassword) {
      setAlertHandlerMessage("Passwords do not match.");
      setAlertHandlerOpen(true);
      return;
    }

    const attributeList = [];
    attributeList.push(
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      })
    );
    let username=email;
    userpool.signUp(username, password, attributeList, null, (err, data) => {
      if (err) {
        console.log(err);
        setAlertHandlerMessage(err.message || "sign up failed");
        setAlertHandlerOpen(true);
      } else {
        console.log(data);
        setAlertHandlerMessage('successful registration\n verification mail was sent');
        setAlertHandlerOpen(true);
        setTimeout(() => {
          Navigate('/login');
        }, 5000);
      }
    });
  };

  const handleAlreadyUserClick = () => {
    Navigate('/login');
  }

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
        <h2 className="pageName">Create new Account</h2>
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
              required
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
              required  
            />
          </div>
          <p className="boxTitle">CONFIRM PASSWORD</p>
          <div className="formBoxes">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Please confirm your password"
              className="input"
              required  
            />
          </div>
          <button className="buttons" onClick={handleSignUp}>Sign up</button>
          <p className="smallText"> Already have an account?&nbsp;&nbsp;
            <button className="inlineButton" onClick={handleAlreadyUserClick}>Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateAccountPage;
