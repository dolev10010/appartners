import React, { useState, useRef } from 'react';
import { FaBed, FaBath, FaHome, FaMoneyBillWave, FaDog, FaParking, FaWater, FaAccessibleIcon } from 'react-icons/fa';
import { MdBalcony, MdDateRange, MdLocationCity } from 'react-icons/md';
import './styles.css';
import Logo from './Logo';
import HeaderButtons from './HeaderButtons';
import BackButton from './BackButton';
import RoommatePopup from './RoommatePopup';
import profileImagePlaceholder from './background-pictures/profilePicture.jpg';
import { useLocation, useNavigate } from 'react-router-dom';

const ApartmentDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const apartment = state?.apartment || {}; // שימוש בערך ריק אם state או apartment לא מוגדרים
    const photos = apartment.photos || []; // הגדרה כברירת מחדל לרשימה ריקה אם photos לא מוגדר
    const roommates = apartment.roommates || []; // הגדרה כברירת מחדל לרשימה ריקה אם roommates לא מוגדרים

    const [selectedRoommate, setSelectedRoommate] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const touchStartRef = useRef(0);

    const handleClosePopup = () => {
        setSelectedRoommate(null);
    };

    const handleBackClick = () => {
        navigate('/find-apartment', { state: { filters: state.filters, sortOrder: state.sortOrder } });
    };

    const handleViewProfile = (email) => {
        window.location.href = `/display-profile?email=${email}`;
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === photos.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? photos.length - 1 : prevIndex - 1
        );
    };

    const handleDotClick = (index) => {
        setCurrentImageIndex(index);
    };

    const handleTouchStart = (e) => {
        touchStartRef.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        if (!touchStartRef.current) return;
        const touchEnd = e.touches[0].clientX;
        if (touchStartRef.current - touchEnd > 50) {
            handleNextImage();
            touchStartRef.current = 0;
        } else if (touchStartRef.current - touchEnd < -50) {
            handlePrevImage();
            touchStartRef.current = 0;
        }
    };

    const handleRoommateClick = (roommate) => {
        setSelectedRoommate(roommate);
    };

    return (
        <div className="container">
            <div className="createProfileBackground"></div>
            <div className="backgroundImageMobile"></div>
            <div className="image-container">
                <HeaderButtons badgeContent={4} />
                <BackButton className="back-button" onClick={handleBackClick}/>
            </div>
            <div className="content">
                <Logo />
                <div className="formRowEdit">
                    <h3 className="pageName">Apartment Details</h3>
                </div>
                <div className="middleBox">
                    <div className="apartment-card">
                        <div
                            className="photo-slider"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                        >
                            <div className="clickable-area left" onClick={handlePrevImage}></div>
                            <div className="photo-slider-images">
                                {photos.map((photo, index) => (
                                    <img
                                        key={index}
                                        src={photo}
                                        alt={`Apartment ${index}`}
                                        className={`slide ${currentImageIndex === index ? '' : 'slide-hidden'}`}
                                    />
                                ))}
                            </div>
                            <div className="clickable-area right" onClick={handleNextImage}></div>
                        </div>
                        <div className="progress-dots">
                            {photos.map((_, index) => (
                                <span
                                    key={index}
                                    className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => handleDotClick(index)}
                                />
                            ))}
                        </div>
                        <div className="roommates">
                            {roommates.slice(0, 3).map((roommate, index) => (
                                <div key={index} className="roommate" onClick={() => handleRoommateClick(roommate)}>
                                    <img
                                        src={roommate.photo_url || profileImagePlaceholder}
                                        alt={`Roommate ${index}`}
                                        className="roommate-image"
                                    />
                                </div>
                            ))}
                            {roommates.length > 3 && (
                                <div className="extra-roommates">
                                    +{roommates.length - 3}
                                </div>
                            )}
                        </div>
                        {selectedRoommate &&
                            <RoommatePopup
                                roommate={selectedRoommate}
                                onClose={handleClosePopup}
                                onViewProfile={handleViewProfile}
                            />}
                    </div>
                    <div className="profileInfo">
                        <p className='profileFullName'>{apartment.city}, {apartment.street}</p>
                        <div className='bioBox'>
                            <p className='bioHeader'>Bio:</p>
                            <p className='profileContent'>{apartment.bio}</p>
                        </div>
                        <div className="detail-item"><MdLocationCity /> <strong>Street:</strong> {apartment.street}</div>
                        <div className="detail-item"><FaBed /> <strong>Total Rooms:</strong> {apartment.total_rooms}</div>
                        <div className="detail-item"><FaBath /> <strong>Available Rooms:</strong> {apartment.available_rooms}</div>
                        <div className="detail-item"><FaHome /> <strong>Apartment Size:</strong> {apartment.appartment_size} sqm</div>
                        <div className="detail-item"><FaMoneyBillWave /> <strong>Price:</strong> ${apartment.price}</div>
                        <div className="detail-item"><FaDog /> <strong>Allow Pets:</strong> {apartment.allow_pets ? 'Yes' : 'No'}</div>
                        <div className="detail-item"><FaParking /> <strong>Has Parking:</strong> {apartment.has_parking ? 'Yes' : 'No'}</div>
                        <div className="detail-item"><MdBalcony /> <strong>Has Balcony:</strong> {apartment.has_balcony ? 'Yes' : 'No'}</div>
                        <div className="detail-item"><FaWater /> <strong>Has Sun Water Heater:</strong> {apartment.has_sun_water_heater ? 'Yes' : 'No'}</div>
                        <div className="detail-item"><FaAccessibleIcon /> <strong>Accessible:</strong> {apartment.is_accessible_to_disabled ? 'Yes' : 'No'}</div>
                        <div className="detail-item"><MdDateRange /> <strong>Entry Date:</strong> {apartment.entry_date}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApartmentDetails;
