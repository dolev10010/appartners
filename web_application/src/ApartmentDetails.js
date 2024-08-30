import React, { useState, useRef } from 'react';
import { FaBed, FaBath, FaHome, FaMoneyBillWave, FaDog, FaParking, FaWater, FaAccessibleIcon, FaBars, FaSnowflake } from 'react-icons/fa';
import { MdBalcony, MdDateRange, MdLocationCity, MdElevator, MdSecurity, MdBedroomParent } from 'react-icons/md';
import { GiWindowBars } from "react-icons/gi";
import { SiRenovatebot } from "react-icons/si";
import './styles.css';
import Logo from './Logo';
import HeaderButtons from './HeaderButtons';
import BackButton from './BackButton';
import RoommatePopup from './RoommatePopup';
import profileImagePlaceholder from './background-pictures/profilePicture.jpg';
import apartmentPlaceholder from "./background-pictures/apartmentPlaceholder.jpg";
import { useLocation, useNavigate } from 'react-router-dom';

const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
};

const ApartmentDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const apartment = state?.apartment || {};
    const photos = apartment.photos || [];
    const roommates = apartment.roommates || [];

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
                <BackButton className="back-button" onClick={handleBackClick} />
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
                                {photos.length > 0 ? (
                                    photos.map((photo, index) => (
                                        <img
                                            key={index}
                                            src={photo}
                                            alt={`Apartment ${index}`}
                                            className={`slide ${currentImageIndex === index ? '' : 'slide-hidden'}`}
                                        />
                                    ))
                                ) : (
                                    <img
                                        src={apartmentPlaceholder}
                                        alt="Apartment Placeholder"
                                        className="slide"
                                    />
                                )}
                            </div>
                            <div className="clickable-area right" onClick={handleNextImage}></div>
                        </div>
                        <div className="progress-dots">
                            {photos.length > 0 ? (
                                photos.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                                        onClick={() => handleDotClick(index)}
                                    />
                                ))
                            ) : (
                                <span className="dot active"></span>
                            )}
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
                        <p className='profileFullName'>{apartment.city}, {apartment.street} {apartment.number}</p>
                        <div className='bioBox'>
                            <p className='bioHeader'>Bio:</p>
                            <p className='profileContent'>{apartment.post_bio}</p>
                        </div>
                        <div className="detail-item"><FaHome /> <strong>{apartment.is_sublet ? 'Sublet' : 'Long Term'}</strong></div>
                        <div className="detail-item"><MdDateRange /> <strong>Entry Date:</strong> {formatDate(apartment.entry_date)}</div>
                        {apartment.is_sublet && apartment.end_date && (
                            <div className="detail-item"><MdDateRange /> <strong>End Date:</strong> {formatDate(apartment.end_date)}</div>
                        )}
                        <div className="detail-item"><FaMoneyBillWave /> <strong>Price -</strong> ${apartment.price}</div>
                        <div className="detail-item"><MdLocationCity /> <strong>{apartment.floor}th Floor</strong> </div>
                        <div className="detail-item"><FaBed /> <strong>Total Rooms:</strong> {apartment.total_rooms}</div>
                        <div className="detail-item"><MdBedroomParent /> <strong>Available Rooms:</strong> {apartment.available_rooms}</div>
                        <div className="detail-item"><FaBath /> <strong>Number of Bethrooms:</strong> {apartment.num_of_toilets}</div>
                        <div className="detail-item"><FaHome /> <strong>Apartment Size:</strong> {apartment.appartment_size} sqm</div>
                        <div className="detail-item"><FaDog /> <strong>{apartment.allow_pets ? '' : 'No '}Pets Allowed</strong></div>
                        <div className="detail-item"><FaParking /> <strong>There is {apartment.has_parking ? '' : 'No'} Parking</strong></div>
                        <div className="detail-item"><MdBalcony /> <strong>There is {apartment.has_balcony ? '' : 'No'} Balcony</strong> </div>
                        <div className="detail-item"><MdElevator /> <strong>There is {apartment.has_elevator ? '' : 'No'} Elevator</strong></div>
                        <div className="detail-item"><MdSecurity /> <strong>There is {apartment.has_mamad ? '' : 'No'} Mamad</strong></div>
                        <div className="detail-item"><FaWater /> <strong>There is {apartment.has_sun_water_heater ? '' : 'No'} Sun Water Heater</strong></div>
                        <div className="detail-item"><FaAccessibleIcon /> <strong>{apartment.is_accessible_to_disabled ? '' : 'Not'} Accessible</strong></div>
                        <div className="detail-item"><FaSnowflake /> <strong>There is {apartment.has_air_conditioner ? '' : 'No'} Air Conditioner</strong></div>
                        <div className="detail-item"><GiWindowBars /> <strong>There is {apartment.has_bars ? '' : 'No'} Bars</strong></div>
                        <div className="detail-item"><SiRenovatebot /> <strong>Status:</strong> {apartment.status}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApartmentDetails;
