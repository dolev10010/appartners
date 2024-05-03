import React, { useState } from "react";
import "./styles.css";
import AlertHandler from './AlertHandler';

function CreateAccountPage({ setCurrentPage }) {
    const [email, setEmail] = useState(null); // State to hold the entered email
    const [password, setPassword] = useState(null); // State to hold the entered password
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
      return password.length >= 8;
    }

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
          setAlertHandlerMessage("Password must be at least 8 characters long.");
          setAlertHandlerOpen(true);
          return;
        }
      
        if (password !== confirmPassword) {
          setAlertHandlerMessage("Passwords do not match.");
          setAlertHandlerOpen(true);
          return;
        }
      
        // Construct the payload
        const userData = {
          email: email,
          password: password
        };
      
        console.log("Sending data to server:", userData);
      
        fetch('http://localhost:5433/registration-info', {
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
          console.log("Registration response data:", data);
          if (data.errorMessage) {
            // Handle specific error messages
            if (data.errorMessage === "Email already exists") {
              alert("Email already in use. Please try another email.");
            } else {
              alert(data.errorMessage); // For other errors, display them directly
            }
          } else {
            console.log("successful registration");
            alert('successful registration');
            setCurrentPage("login");
          }
        });
      };


      const handleAlreadyUserClick = () => {
        setCurrentPage("login");
      }

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
        <h2 className="pageName">Create new Account</h2>

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
                        required
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
                        required  
                    />
                </div>
                <text className="boxTitle">CONFIRM PASSWORD</text>
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
                <p className="smallText"> Already have account?   
                <button className="inlineButton" onClick={handleAlreadyUserClick}>Sign In</button>
                </p>
            </div>
        </div>
    </div>
  );
}

export default CreateAccountPage;
