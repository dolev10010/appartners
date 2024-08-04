import React, { useState } from 'react';
import cameraIcon from './images/camera_icon.png';
import Modal from './Modal'; // Import the Modal component

const ApartmentForm = ({ apartment, imagePreviews, onChange, onPhotoUpload, onRemovePhoto, onSubmit, onCancel }) => {
  const photos = apartment.photos || [];
  const [emailInput, setEmailInput] = useState(apartment.roommate_emails.join(', '));
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const handleRoommateEmailsChange = (e) => {
    const value = e.target.value;
    setEmailInput(value);
    const emails = value
      .split(',')
      .map(email => email.trim())
      .filter(email => email !== ''); // Remove empty strings
    onChange({ target: { name: 'roommate_emails', value: emails } });
  };

  const handleImageClick = (src) => {
    setCurrentImage(src);
    setShowModal(true);
  };

  return (
    <div className="post-apartment-apartmentForm">
      {/* Form Fields */}
      <div className="post-apartment-formRow">
        <div className="post-apartment-formGroup">
          <label>City</label>
          <input type="text" name="city" value={apartment.city} onChange={onChange} className="post-apartment-input formBoxes" placeholder="City name" />
        </div>
        <div className="post-apartment-formGroup">
          <label>Street</label>
          <input type="text" name="street" value={apartment.street} onChange={onChange} className="post-apartment-input formBoxes" placeholder="Street name" />
        </div>
      </div>
      <div className="post-apartment-formRow">
        <div className="post-apartment-formGroup">
          <label>Number</label>
          <input type="text" name="number" value={apartment.number} onChange={onChange} className="post-apartment-input formBoxes" placeholder="Apartment number" />
        </div>
        <div className="post-apartment-formGroup">
          <label>Floor</label>
          <input type="text" name="floor" value={apartment.floor} onChange={onChange} className="post-apartment-input formBoxes" placeholder="Floor number" />
        </div>
      </div>
      <div className="post-apartment-formRow">
        <div className="post-apartment-formGroup">
          <label>Number of Rooms</label>
          <input type="number" name="total_rooms" value={apartment.total_rooms} onChange={onChange} min="1" className="post-apartment-input formBoxes" />
        </div>
        <div className="post-apartment-formGroup">
          <label>Apartment Size (sqm)</label>
          <input type="number" name="appartment_size" value={apartment.appartment_size} onChange={onChange} min="1" className="post-apartment-input formBoxes" />
        </div>
        <div className="post-apartment-formGroup">
          <label>Available Rooms</label>
          <input type="number" name="available_rooms" value={apartment.available_rooms} onChange={onChange} min="1" className="post-apartment-input formBoxes" />
        </div>
      </div>
      <div className="post-apartment-formRow">
        <div className="post-apartment-formGroup">
          <label>Number of Bathrooms</label>
          <input type="number" name="num_of_toilets" value={apartment.num_of_toilets} onChange={onChange} min="1" className="post-apartment-input formBoxes" />
        </div>
        <div className="post-apartment-formGroup">
          <label>Price (ILS)</label>
          <input type="number" name="price" value={apartment.price} onChange={onChange} min="1" className="post-apartment-input formBoxes" />
        </div>
        <div className="post-apartment-formGroup">
          <label>Number of Roommates</label>
          <input type="number" name="num_of_roommates" value={apartment.num_of_roommates} onChange={onChange} min="1" className="post-apartment-input formBoxes" />
        </div>
      </div>
      <div className="post-apartment-formRow">
        <div className="post-apartment-formGroup">
          <label>Parking</label>
          <input type="checkbox" name="has_parking" checked={apartment.has_parking} onChange={onChange} />
        </div>
        <div className="post-apartment-formGroup">
          <label>Elevator</label>
          <input type="checkbox" name="has_elevator" checked={apartment.has_elevator} onChange={onChange} />
        </div>
        <div className="post-apartment-formGroup">
          <label>Balcony</label>
          <input type="checkbox" name="has_balcony" checked={apartment.has_balcony} onChange={onChange} />
        </div>
      </div>
      <div className="post-apartment-formRow">
        <div className="post-apartment-formGroup">
          <label>Furnished</label>
          <input type="checkbox" name="is_furnished" checked={apartment.is_furnished} onChange={onChange} />
        </div>
        <div className="post-apartment-formGroup">
          <label>Air Conditioning</label>
          <input type="checkbox" name="has_air_conditioner" checked={apartment.has_air_conditioner} onChange={onChange} />
        </div>
        <div className="post-apartment-formGroup">
          <label>Water Heater</label>
          <input type="checkbox" name="has_sun_water_heater" checked={apartment.has_sun_water_heater} onChange={onChange} />
        </div>
      </div>
      <div className="post-apartment-formRow">
        <div className="post-apartment-formGroup">
          <label>Mamad</label>
          <input type="checkbox" name="has_mamad" checked={apartment.has_mamad} onChange={onChange} />
        </div>
        <div className="post-apartment-formGroup">
          <label>Bars</label>
          <input type="checkbox" name="has_bars" checked={apartment.has_bars} onChange={onChange} />
        </div>
        <div className="post-apartment-formGroup">
          <label>Accessible</label>
          <input type="checkbox" name="is_accessible_to_disabled" checked={apartment.is_accessible_to_disabled} onChange={onChange} />
        </div>
      </div>
      <div className="post-apartment-formRow">
        <div className="post-apartment-formGroup">
          <label>Allow Pets</label>
          <input type="checkbox" name="allow_pets" checked={apartment.allow_pets} onChange={onChange} />
        </div>
        <div className="post-apartment-formGroup">
          <label>Keep Kosher</label>
          <input type="checkbox" name="keep_kosher" checked={apartment.keep_kosher} onChange={onChange} />
        </div>
        <div className="post-apartment-formGroup">
          <label>Status</label>
          <select name="status" value={apartment.status} onChange={onChange} className="post-apartment-input formBoxes small-height">
            <option value="new">New</option>
            <option value="renovated">Renovated</option>
            <option value="standard">Standard</option>
          </select>
        </div>
      </div>
      <div className="post-apartment-formGroup">
        <label>Entry Date</label>
        <input type="date" name="entry_date" value={apartment.entry_date} onChange={onChange} className="post-apartment-input formBoxes" />
      </div>
      <div className="post-apartment-formGroup">
        <label>Sublet</label>
        <input type="checkbox" name="is_sublet" checked={apartment.is_sublet} onChange={onChange} />
      </div>
      {apartment.is_sublet && (
        <div className="post-apartment-formGroup">
          <label>End Date</label>
          <input type="date" name="end_date" value={apartment.end_date} onChange={onChange} className="post-apartment-input formBoxes" />
        </div>
      )}
      <div className="post-apartment-formGroup">
        <label>Roommate Emails</label>
        <input
          type="text"
          name="roommate_emails"
          value={emailInput}
          onChange={handleRoommateEmailsChange}
          className="post-apartment-input formBoxes"
          placeholder="Enter emails separated by comma"
        />
      </div>
      {/* Photo Upload */}
      <div className="post-apartment-formGroup">
        <input type="file" id="photos" name="photos" multiple onChange={onPhotoUpload} className="post-apartment-fileInput" />
        <label htmlFor="photos" className="post-apartment-fileInputLabel">
          Upload Photos
          <img src={cameraIcon} alt="camera icon" className="post-apartment-cameraIcon" />
        </label>
        <div className="post-apartment-imagePreviewContainer">
          {imagePreviews.map((src, index) => (
            <div key={index} className="post-apartment-imagePreviewWrapper">
              <img src={src} alt={`Preview ${index}`} className="post-apartment-imagePreview" onClick={() => handleImageClick(src)} />
              <button className="post-apartment-removeButton" onClick={() => onRemovePhoto(index)}>x</button>
            </div>
          ))}
        </div>
      </div>
      <div className="post-apartment-formGroup">
        <label>Bio</label>
        <textarea
          name="post_bio"
          value={apartment.post_bio}
          onChange={onChange}
          className="post-apartment-input formBoxes post-apartment-textarea"
          placeholder="Insert short description"
          maxLength="400"
        />
      </div>
      {/* Submit and Cancel Buttons */}
      <div className="post-apartment-formButtons">
        <button className="post-apartment-button publishButton" onClick={onSubmit}>Submit</button>
        <button className="post-apartment-button cancelButton" onClick={onCancel}>Cancel</button>
      </div>

      {/* Modal for larger image view */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <img src={currentImage} alt="Larger view" className="modal-image" />
      </Modal>
    </div>
  );
};

export default ApartmentForm;
