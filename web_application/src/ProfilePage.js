import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./styles.css";
import profileImage from "./background-pictures/profilePicture.jpg";

function CreateProfilePage() {
    //const Navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setBirthDate] = useState('');
    const [smoker, setSmoker] = useState(false);
    const [animalLover, setAnimalLover] = useState(false);
    const [kosher, setKosher] = useState(false);
    const [profession, setProfession] = useState('');
    const [relationshipStatus, setRelationshipStatus] = useState('');
    const [animalOwnership, setAnimalOwnership] = useState('');
    const [allergies, setAllergies] = useState('');
    const [hobbies, setHobbies] = useState('');
    const [bio, setBio] = useState('');
    const [uploadedImage, setFile] = useState();

    // Validation functions
    const validateDateOfBirth = () => {
        if (!dateOfBirth) {
            return false;
        }
        const birthDate = new Date(dateOfBirth);
        const currentDate = new Date();
        const ageDifference = currentDate.getFullYear() - birthDate.getFullYear();
        const isOlderThan18 = ageDifference > 18 || (ageDifference === 18 && currentDate.getMonth() > birthDate.getMonth());
        return isOlderThan18;
    }

    const validateAnimalOwnership = () => {
        const alphanumericRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
        return alphanumericRegex.test(animalOwnership);
    };

    // Change handlers
    const handleImageChange = (event) => {
        setFile(URL.createObjectURL(event.target.files[0]));
    };

    const handleFullNameChange = (event) => {
        setFullName(event.target.value);
      };
    
    const handleGenderChange = (event) => {
    setGender(event.target.value);
    };
    
    const handleDateOfBirthChange = (event) => {
    setBirthDate(event.target.value);
    };

    const handleSmokerChange = () => {
        setSmoker(!smoker);
    }
    
    const handleAnimalLoverChange = () => {
        setAnimalLover(!animalLover);
    }
    
    const handleKosherChange = () => {
        setKosher(!kosher);
    }
  
    const handleProfessionChange = (event) => {
    setProfession(event.target.value);
    }

    const handleRelationshipChange = (event) => {
    setRelationshipStatus(event.target.value);
    }

    const handleAnimalOwnershipChange = (event) => {
    setAnimalOwnership(event.target.value);
    }

    const handleAllergiesChange = (event) => {
    setAllergies(event.target.value);
    }
    
    const handleHobbiesChange = (event) => {
    setHobbies(event.target.value);
    }

    const handleBioChange = (event) => {
    setBio(event.target.value);
    }

    // const handleCreateProfile = () => {
    //     if (!fullName || !dateOfBirth || !gender) {
    //         setAlertHandlerMessage("Please fill in all fields.");
    //         setAlertHandlerOpen(true);
    //         return;
    //     }

    //     if (!validateDateOfBirth()) {
    //         setAlertHandlerMessage("You must be older than 18 years old to create a profile.");
    //         setAlertHandlerOpen(true);
    //         return;
    //     }

    //     Navigate('/HomePage');
    // };


  return (
    <div className="container">
        <div className="backgroundImage"></div> {/* For larger screens */}
        <div className="backgroundImageMobile"></div> {/* For smaller screens */}
            <div className="content">
                <h1 className="logo">Appartners</h1>
                <h2 className="pageName">Profile</h2>
                <div className="middleFormBox">
                    <div className="pictureButtonContainer">
                        <label className="pictureButton">
                            <img
                                src={uploadedImage || profileImage}
                                className="profileImage"
                                alt=""
                            />
                            <input
                                type="file"
                                accept="image/*"
                                className="pictureButtonInput"
                                onChange={handleImageChange} 
                            />
                        </label>
                    </div>
                    <text className="boxTitle">FULL NAME</text>
                        <div className="formBoxes">
                            <input
                                type="text" 
                                id="Full Name" 
                                value={fullName} 
                                onChange={handleFullNameChange}
                                placeholder="Please enter your full name"
                                className="input"
                            />
                        </div> 
                    <div className="rowBoxesContainer">
                        <div className="labelAndBoxContainer">
                            <label htmlFor="gender" className="boxTitle">GENDER</label>
                            <div className="smallBox">
                                <select 
                                    id="gender"
                                    name="Gender"
                                    value={gender}
                                    onChange={handleGenderChange}
                                    placeholder="Gender"
                                    className="input"
                                >
                                    <option value="" disabled hidden>Select your Gender</option>
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="labelAndBoxContainer">
                            <label htmlFor="dateOfBirth" className="boxTitle">DATE OF BIRTH</label>
                            <div className="smallBox">
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={dateOfBirth}
                                    onChange={handleDateOfBirthChange}
                                    placeholder="dd/mm/yyyy"
                                    className="input"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="rowBoxesContainer">
                        <div className="labelAndBoxContainer">
                            <label htmlFor="smoker" className="boxTitle">SMOKER</label>
                            <input type="checkbox" id="smoker" name="smoker" checked={smoker} onChange={handleSmokerChange} />
                        </div>
                        <div className="labelAndBoxContainer">
                            <label htmlFor="animalLover" className="boxTitle">ANIMAL LOVER</label>
                            <input type="checkbox" id="animalLover" name="animalLover" checked={animalLover} onChange={handleAnimalLoverChange} />
                        </div>
                        <div className="labelAndBoxContainer">
                            <label htmlFor="kosher" className="boxTitle">KEEPS KOSHER</label>
                            <input type="checkbox" id="kosher" name="kosher" checked={kosher} onChange={handleKosherChange} />
                        </div>
                    </div>
                    <div  className="rowBoxesContainer">
                        <div className="labelAndBoxContainer">
                            <label htmlFor="gender" className="boxTitle">PROFESSION</label>
                            <div className="smallBox">
                                <input
                                    type="text" 
                                    id="Profession" 
                                    value={profession} 
                                    onChange={handleProfessionChange}
                                    placeholder="Profession"
                                    className="input"
                                />
                            </div>
                        </div>
                        <div className="labelAndBoxContainer">
                            <label htmlFor="dateOfBirth" className="boxTitle">RELATIONSHIP</label>
                            <div className="smallBox">
                                <select 
                                    id="relationshipStatus"
                                    name="relationshipStatus"
                                    value={relationshipStatus}
                                    onChange={handleRelationshipChange}
                                    placeholder="relationshipStatus"
                                    className="input"
                                >
                                    <option value="" disabled selected hidden>Relationship Status</option>
                                    <option value="single">Single</option>
                                    <option value="inRelationship">In Relationship</option>
                                    {/* Add more options if needed */}
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <text className="boxTitle">ANIMAL OWNERSHIP</text>
                    <div className="formBoxes">
                        <input
                            type="text" 
                            id="animalOwnership" 
                            value={animalOwnership} 
                            onChange={handleAnimalOwnershipChange}
                            placeholder="Animal type and quantity"
                            className="input"
                        />
                    </div>
                    <text className="boxTitle">ALLERGIES</text>
                    <div className="formBoxes">
                        <input
                            type="text" 
                            id="allergies" 
                            value={allergies} 
                            onChange={handleAllergiesChange}
                            placeholder="Please enter your allergies"
                            className="input"
                        />
                    </div>
                    <text className="boxTitle">HOBBIES</text>
                    <div className="formBoxes">
                        <input
                            type="text" 
                            id="hobbies" 
                            value={hobbies} 
                            onChange={handleHobbiesChange}
                            placeholder="Please enter your hobbies"
                            className="input"
                        />
                    </div>
                    <text className="boxTitle">BIO</text>
                    <div className="bigBox">
                        <input
                            type="text" 
                            id="bio" 
                            value={bio} 
                            onChange={handleBioChange}
                            placeholder="Please enter short BIO"
                            className="input"
                        />
                    </div>
                </div>
                <button className="buttons">Save Profile</button>
                {/* onClick={handleCreateProfile} */}
            </div> 
    </div>
  );
}

export default CreateProfilePage;
