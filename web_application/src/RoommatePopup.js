import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { FaTimes } from 'react-icons/fa';
import { RiInfoI } from "react-icons/ri";
import { CiLocationArrow1 } from "react-icons/ci";
import UserContext from './UserContext';


const RoommatePopup = ({ roommate, onClose, onViewProfile }) => {
    const navigate = useNavigate();
    const { userEmail } = useContext(UserContext);

    const handleViewProfileClick = () => {
        if (roommate && roommate.email) {
            onViewProfile(roommate.email);
        } else {
            console.error("No email found for the roommate.");
        }
    };

    const handleNavigateToChat = (email) => {
        if (userEmail) {
            navigate(`/chat?email=${email}`);
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="roommate-popup">
            <button className="close-btn" onClick={onClose}><FaTimes /></button>
            <div className="popup-header">
                <img src={roommate.photo_url} alt={roommate.full_name} className="popup-avatar" />
                <h3>{roommate.full_name}</h3>
            </div>
            <div className="popup-content">
                <p><strong>BIO:</strong></p>
                <p>{roommate.bio}</p>
            </div>
            <div className="popup-footer">
                <button className="info-btn-popup" onClick={handleViewProfileClick}><RiInfoI /></button>
                <button className="message-btn-popup" onClick={() => handleNavigateToChat(roommate.email)}><CiLocationArrow1 /></button>
            </div>
        </div>
    );
};

export default RoommatePopup;
