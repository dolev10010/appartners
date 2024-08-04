import React from 'react';
import './PostView.css'; // Ensure this CSS file is imported

const PostView = ({ apartments, onSelect, onDelete }) => {
  return (
    <div className="post-apartment-apartmentList">
      {apartments.map((apartment) => (
        <div key={apartment.post_id} className="post-apartment-apartmentItem">
          <button
            className="delete-post-button"
            onClick={() => onDelete(apartment)}
          >
            x
          </button>
          {apartment.photos && apartment.photos.length > 0 && (
            <img
              src={apartment.photos[0]}
              alt="Apartment"
              className="apartment-photo"
              onClick={() => onSelect(apartment)}
            />
          )}
          <div className="apartment-details" onClick={() => onSelect(apartment)}>
            <p><strong>Address:</strong> {apartment.street} {apartment.number}, {apartment.city}</p>
            <p><strong>Price:</strong> {apartment.price} ILS</p>
            {apartment.roommate_photos && apartment.roommate_photos.length > 0 && (
              <div className="roommate-photos">
                {apartment.roommate_photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
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
