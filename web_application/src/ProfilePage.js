import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import userPool from './UserPool';
import UserContext from './UserContext';
import "./styles.css";
import profileImage from "./background-pictures/profilePicture.jpg";
import config from './config.json';
import AWS from 'aws-sdk';

const labCredentials = config.labCredentials;
const accessKeyId = labCredentials.accessKeyId;
const secretAccessKey = labCredentials.secretAccessKey;
const sessionToken = labCredentials.sessionToken;
const region = labCredentials.region;

AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    sessionToken: sessionToken,
    region: region
});

const s3 = new AWS.S3();

function ProfilePage() {
    const navigate = useNavigate();
    const { userEmail, clearUserEmail } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setBirthDate] = useState('');
    const [smoker, setSmoker] = useState(false);
    const [animalLover, setAnimalLover] = useState(false);
    const [kosher, setKosher] = useState(false);
    const [profession, setProfession] = useState('');
    const [relationshipStatus, setRelationshipStatus] = useState('');
    const [animalOwnership, setAnimalOwnership] = useState(false);
    const [allergies, setAllergies] = useState('');
    const [hobbies, setHobbies] = useState('');
    const [bio, setBio] = useState('');
    const [uploadedImage, setFile] = useState();
    const [presentedImage, setImage] = useState(profileImage);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch(`http://${config.serverPublicIP}:5433/get-profile?email=${userEmail}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setFullName(`${data.first_name || ''} ${data.last_name || ''}`.trim());
                        setGender(data.sex);
                        setBirthDate(formatDate(data.birthday));
                        setSmoker(data.smoking);
                        setAnimalLover(data.like_animals);
                        setKosher(data.keeps_kosher);
                        setProfession(data.profession);
                        setRelationshipStatus(data.status);
                        setAnimalOwnership(data.has_animals);
                        setAllergies(data.alergies);
                        setHobbies(data.hobbies);
                        setBio(data.profile_bio);
                        setImage(data.photo_url || profileImage);
                    } else {
                        // Default values for a new user
                        setFullName('');
                        setGender('');
                        setBirthDate('');
                        setSmoker(false);
                        setAnimalLover(false);
                        setKosher(false);
                        setProfession('');
                        setRelationshipStatus('');
                        setAnimalOwnership('');
                        setAllergies('');
                        setHobbies('');
                        setBio('');
                        setImage(profileImage);
                    }
                } else {
                    console.error('Failed to fetch profile data');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        };

        fetchProfileData();
    }, [userEmail]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const uploadToS3 = (file) => {
        const fileExtension = file.name.split('.').pop();
        const fileName = `${userEmail}.${fileExtension}`;
        const uploadParams = {
            Bucket: 'appartners-profile-images',
            Key: fileName,
            Body: file,
        };

        return new Promise((resolve, reject) => {
            s3.upload(uploadParams, (err, data) => {
                if (err) {
                    console.error('Error uploading file:', err);
                    reject(err);
                } else {
                    console.log('File uploaded successfully:', data.Location);
                    resolve(data.Location);
                }
            });
        });
    };

    const calculateAge = (birthdate) => {
        const today = new Date();
        const dob = new Date(birthdate);
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    };

    const validateDateOfBirth = () => {
        if (!dateOfBirth) {
            return false;
        }
        const birthDate = new Date(dateOfBirth);
        const currentDate = new Date();
        const ageDifference = currentDate.getFullYear() - birthDate.getFullYear();
        const isOlderThan18 = ageDifference > 18 || (ageDifference === 18 && currentDate.getMonth() > birthDate.getMonth());
        return isOlderThan18;
    };

    const validateAnimalOwnership = () => {
        const alphanumericRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
        return alphanumericRegex.test(animalOwnership);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
        setImage(URL.createObjectURL(file));
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
    };

    const handleAnimalLoverChange = () => {
        setAnimalLover(!animalLover);
    };

    const handleKosherChange = () => {
        setKosher(!kosher);
    };

    const handleProfessionChange = (event) => {
        setProfession(event.target.value);
    };

    const handleRelationshipChange = (event) => {
        setRelationshipStatus(event.target.value);
    };

    const handleAnimalOwnershipChange = (event) => {
        setAnimalOwnership(!animalOwnership);
    };

    const handleAllergiesChange = (event) => {
        setAllergies(event.target.value);
    };

    const handleHobbiesChange = (event) => {
        setHobbies(event.target.value);
    };

    const handleBioChange = (event) => {
        setBio(event.target.value);
    };

    const handleSaveProfile = async () => {
        console.log("Save button clicked");
        const [firstName, lastName] = fullName.split(" ");

        try {
            const imageUrl = uploadedImage ? await uploadToS3(uploadedImage) : presentedImage;

            const profileData = {
                email: userEmail,
                profile_bio: bio,
                photo_url: imageUrl,
                first_name: firstName,
                last_name: lastName,
                sex: gender,
                birthday: dateOfBirth,
                age: calculateAge(dateOfBirth),
                smoking: smoker,
                like_animals: animalLover,
                keeps_kosher: kosher,
                first_roomate_appartment: null,
                profession: profession,
                status: relationshipStatus,
                hobbies: hobbies,
                has_animals: animalOwnership,
                alergies: allergies
            };

            const response = await fetch(`http://${config.serverPublicIP}:5433/update-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });

            if (response.ok) {
                console.log("Profile updated successfully");
                navigate('/homepage');
            } else {
                console.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    const handleLogout = () => {
        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser) {
            cognitoUser.signOut();
            clearUserEmail();
            localStorage.removeItem('profileImage');
            navigate('/login');
        }
    };

    if (loading) {
        return null;
    }

    return (
        <div className="container profileContainer">
            <div className="backgroundImage"></div>
            <div className="backgroundImageMobile"></div>
            <div className="content">
                <h1 className="logo">Appartners</h1>
                <h2 className="pageName">Profile</h2>
                <button className="logoutButton" onClick={handleLogout}>Log Out</button>
                <div className="middleFormBox">
                    <div className="pictureButtonContainer">
                        <label className="pictureButton">
                            <img
                                src={presentedImage}
                                className="profileImage"
                                alt="Profile"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                className="pictureButtonInput"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                    <div className="labelAndBoxContainer">
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
                                    className="input"
                                    placeholder= "Select your Gender"
                                >
                                    <option value="">Select your Gender</option>
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
<div className="checkboxes-container">
    <div className="checkbox-row">
        <div className="labelAndBoxContainerCheckbox">
            <label htmlFor="smoker" className="checkbox-label">SMOKER</label>
            <div className="checkbox-container">
            <input type="checkbox" id="smoker" checked={smoker} onChange={handleSmokerChange} />
        </div>
        </div>
        <div className="labelAndBoxContainerCheckbox">
            <label htmlFor="kosher" className="checkbox-label">KEEPS KOSHER</label>
            <div className="checkbox-container">
            <input type="checkbox" id="kosher" checked={kosher} onChange={handleKosherChange} />
            </div>
        </div>
    </div>
    <div className="checkbox-row">
        <div className="labelAndBoxContainerCheckbox">
            <label htmlFor="animalOwner" className="checkbox-label">ANIMAL OWNER</label>
            <div className="checkbox-container">
            <input type="checkbox" id="animalOwner" checked={animalOwnership} onChange={handleAnimalOwnershipChange} />
            </div>
        </div>
        <div className="labelAndBoxContainerCheckbox">
            <label htmlFor="animalLover" className="checkbox-label">ANIMAL LOVER</label>
            <div className="checkbox-container">
            <input type="checkbox" id="animalLover" checked={animalLover} onChange={handleAnimalLoverChange} />
            </div>
        </div>
    </div>
</div>

                    <div className="rowBoxesContainer">
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
                            <label htmlFor="relationshipStatus" className="boxTitle">RELATIONSHIP</label>
                            <div className="smallBox">
                                <select
                                    id="relationshipStatus"
                                    name="relationshipStatus"
                                    value={relationshipStatus}
                                    onChange={handleRelationshipChange}
                                    className="input"
                                >
                                    <option value="">Relationship Status</option>
                                    <option value="single">Single</option>
                                    <option value="inRelationship">In Relationship</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="rowBoxesContainer">
                        <div className="labelAndBoxContainer">
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
                        </div>
                    </div>
                    <div className="rowBoxesContainer">
                        <div className="labelAndBoxContainer">
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
                        </div>
                    </div>
                    <div className="rowBoxesContainer">
                        <div className="labelAndBoxContainer">
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

                    </div>
                </div>
                <button className="buttons" onClick={handleSaveProfile}>Save Profile</button>
            </div>
        </div>
    );
}

export default ProfilePage;
