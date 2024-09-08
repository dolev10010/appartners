import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Logo from './Logo';
import HeaderButtons from './HeaderButtons';
import BackButton from './BackButton';
import profileImagePlaceholder from "./background-pictures/profilePicture.jpg";
import config from './config.json';
import './DisplayProfile.css'


import { FaBirthdayCake, FaSmoking, FaPaw, FaDog, FaBriefcase, FaHeart, FaGamepad, FaStarOfDavid } from 'react-icons/fa';
import { MdWc, MdLocalHospital } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';

function DisplayProfile() {
    const navigate = useNavigate();
    const location = useLocation();

    const { email } = useParams();
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        fullName: '',
        gender: '',
        dateOfBirth: '',
        smoker: false,
        animalLover: false,
        kosher: false,
        profession: '',
        relationshipStatus: '',
        animalOwnership: false,
        allergies: '',
        hobbies: '',
        bio: '',
        profileImage: profileImagePlaceholder,
    });

    const handleBackClick = () => {
        if (location.state?.from === 'find-roommate' && location.state?.filters) {
            navigate('/find-roomate', { state: { filters: location.state.filters } });
        } else {
            navigate(-1);  // Just go back to the previous page
        }
    };


    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch(`http://${config.serverPublicIP}:5433/get-profile?email=${email}`);
                if (response.ok) {
                    const data = await response.json();
                    const formattedDate = new Date(data.birthday).toLocaleDateString('en-GB'); // Format the date to DD/MM/YYYY
                    setProfileData({
                        fullName: `${data.first_name} ${data.last_name}`,
                        gender: data.sex,
                        dateOfBirth: formattedDate,
                        smoker: data.smoking,
                        animalLover: data.like_animals,
                        kosher: data.keeps_kosher,
                        profession: data.profession,
                        relationshipStatus: data.status,
                        animalOwnership: data.has_animals,
                        allergies: data.alergies,
                        hobbies: data.hobbies,
                        bio: data.profile_bio,
                        profileImage: data.photo_url || profileImagePlaceholder,
                    });
                } else {
                    console.error('Failed to fetch profile data');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (email) {
            fetchProfileData();
        }
    }, [email]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="createProfileBackground"></div> {/* For larger screens */}
            <div className="backgroundImageMobile"></div> {/* For smaller screens */}
            <div className="image-container">
                <HeaderButtons badgeContent={4} />
                <BackButton onClick={handleBackClick} />
            </div>
            <div className="content">
                <Logo />
                <div className="formRowEdit">
                    <h3 className="pageName">Profile</h3>
                </div>
                <div className="middleBox">
                    <img src={profileData.profileImage} className="profileImageProfile" alt="Profile" />
                    <div className="profileInfo">
                        <p className='profileFullName'>{profileData.fullName}</p>
                        <div className='bioBox'>
                            <p className='bioHeader'>Bio:</p>
                            <p className='profileContent'>{profileData.bio}</p>
                        </div>
                        <p className='profileDetails'>Details:</p>
                        <p className='profileContent'><MdWc /> {profileData.gender}</p>
                        <p className='profileContent'><FaBirthdayCake /> {profileData.dateOfBirth}</p>
                        <p className='profileContent'><FaSmoking /> I am {profileData.smoker ? '' : 'not'} a smoker</p>
                        <p className='profileContent'><FaStarOfDavid /> I {profileData.kosher ? '' : 'dont'} eat kosher</p>
                        <p className='profileContent'><FaPaw /> I {profileData.animalLover ? '' : 'dont'} love animals</p>
                        <p className='profileContent'><FaDog /> I {profileData.animalOwnership ? '': 'dont'} have animals</p>
                        <p className='profileContent'><FaBriefcase /> My profession is {profileData.profession}</p>
                        <p className='profileContent'><FaHeart /> I am {profileData.relationshipStatus}</p>
                        {profileData.allergies && (
                            <p className='profileContent'><MdLocalHospital /> My allergies are {profileData.allergies}</p>
                        )}
                        <p className='profileContent'><FaGamepad /> My Hobbies are {profileData.hobbies}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DisplayProfile;
