import React from 'react';
import './PostView.css';
import apartmentPlaceholder from './background-pictures/apartmentPlaceholder.jpg'; // Placeholder image for apartments
import profileImagePlaceholder from './background-pictures/profilePicture.jpg'; // Placeholder for roommate photos

const PostView = ({ apartments, onSelect, onDelete }) => {
  // Sort the apartments by post_id in ascending order
  const sortedApartments = apartments.sort((a, b) => a.post_id - b.post_id); 

  return (
    <div className="post-apartment-apartmentList">
      {sortedApartments.map((apartment) => (
        <div key={apartment.post_id} className="post-apartment-apartmentItem">
          <button
            className="delete-post-button"
            onClick={() => onDelete(apartment)}
          >
            x
          </button>
          {/* Show apartment's first photo or a placeholder if no photos are available */}
          <img
            src={apartment.photos && apartment.photos.length > 0 ? apartment.photos[0] : apartmentPlaceholder}
            alt="Apartment"
            className="apartment-photo"
            onClick={() => onSelect(apartment)}
          />
          
          <div className="apartment-details" onClick={() => onSelect(apartment)}>
            <p><strong>Address:</strong> {apartment.street} {apartment.number}, {apartment.city}</p>
            <p><strong>Price:</strong> {apartment.price} ILS</p>
            
            {/* Show roommate photos or a placeholder if no photos are available */}
            {apartment.roommate_photos && apartment.roommate_photos.length > 0 && (
              <div className="roommate-photos">
                {apartment.roommate_photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo || profileImagePlaceholder} // Use placeholder if roommate photo is missing
                    alt={`Roommate ${index}`}
                    className="roommate-photo"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostView;
