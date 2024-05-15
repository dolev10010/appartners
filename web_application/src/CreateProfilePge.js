import React, { useState } from "react";
//import { useNavigate } from 'react-router-dom';
import "./styles.css";

function CreateProfilePage({}) {
    //const Navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setBirthDate] = useState('');
    const [smoker, setSmoker] = useState(false);
    const [animalLover, setAnimalLover] = useState(false);
    const [kosher, setKosher] = useState(false);
    const [profession, setProfession] = useState('');
    const [relationshipStatus, setRelationshipStatus] = useState('');
    const [animalOwnership, setAnimalOwnership] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [hobbies, setHobbies] = useState([]);
    const [bio, setBio] = useState([]);

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
        // Handle image upload 
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

    const handleSmokerChange = (event) => {
    setSmoker(event.target.value);
    }

    const handleAnimalLoverChange = (event) => {
    setAnimalLover(event.target.value);
    }

    const handleKosherChange = (event) => {
    setKosher(event.target.value);
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
    //     if (!fullName || !hobbies || !bio || !allergies || !animalOwnership || !relationshipStatus || !profession || !dateOfBirth || !gender) {
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
                <h2 className="pageName">Create Profile</h2>
                <div className="middleFormBox">
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <button style={{ border: "none", background: "none", position: "relative", overflow: "hidden", marginBottom:"15px" }}>
                            <img
                                //src="./background-pictures/profilePicture.jpg"
                                //alt="profile"
                                className="profileImage"
                                style={{ width: "107.2px", height: "107.2px", borderRadius: "50%" }}
                            /> {/* Placeholder image */}
                            <input
                                type="file"
                                accept="image/*"
                                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                                onChange={handleImageChange} 
                            />
                        </button>
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
                    <div  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "15px", textAlign: "left"}}>
                        <div style={{ display: "flex", alignItems: "left", justifyContent: "space-between", flexDirection: "column", marginRight: "15px"}}>
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
                        <div style={{ display: "flex", alignItems: "left", justifyContent: "space-between", flexDirection: "column"}}>
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
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "15px"}}>
                        <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center"}}>
                            <label htmlFor="smoker" className="rowBoxTitle">SMOKER </label>
                            <label htmlFor="animalLover" className="rowBoxTitle">ANIMAL LOVER</label>
                            <label htmlFor="kosher" className="boxTitle">KEEPS KOSHER</label>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "left"}}>
                            <input type="checkbox" id="smoker" name="smoker" checked={smoker} onChange={handleSmokerChange} style={{marginRight: "110px", backgroundColor: "transparent", border: "#d6e0e2"}} />
                            <input type="checkbox" id="animalLover" name="animalLover" checked={animalLover} onChange={handleAnimalLoverChange} style={{marginRight: "140px", backgroundColor: "transparent"}} />
                            <input type="checkbox" id="kosher" name="kosher" checked={kosher} onChange={handleKosherChange} style={{backgroundColor: "transparent"}} />
                        </div>
                    </div>
                    <div  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "15px", marginBottom:"15px", textAlign: "left"}}>
                        <div style={{ display: "flex", alignItems: "left", justifyContent: "space-between", flexDirection: "column", marginRight: "15px"}}>
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
                        <div style={{ display: "flex", alignItems: "left", justifyContent: "space-between", flexDirection: "column"}}>
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
                                    {/* Add more options */}
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
                    <text className="boxTitle" style={{marginTop: "15px"}}>ALLERGIES</text>
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
                    <text className="boxTitle" style={{marginTop: "15px"}}>HOBBIES</text>
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
                    <text className="boxTitle" style={{marginTop: "15px"}}>BIO</text>
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
                <button className="buttons">Create Profile</button>
                {/* onClick={handleCreateProfile} */}
            </div> 
    </div>
  );
}

export default CreateProfilePage;