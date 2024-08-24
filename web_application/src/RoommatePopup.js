import React from 'react';
import './styles.css';
import { FaTimes, FaInfoCircle } from 'react-icons/fa';
import { RiInfoI } from "react-icons/ri";

const RoommatePopup = ({ roommate, onClose, onViewProfile }) => {
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
                <button className="info-btn-popup" onClick={() => onViewProfile(roommate.email)}><RiInfoI /></button>
            </div>
        </div>
    );
};

export default RoommatePopup;
