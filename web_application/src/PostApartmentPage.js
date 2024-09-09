import React, { useState, useEffect, useContext } from 'react';
import Logo from "./Logo";
import UserContext from './UserContext';
import config from './config.json';
import AWS from 'aws-sdk';
import ApartmentForm from './ApartmentForm';
import HeaderButtons from "./HeaderButtons";
import PostView from './PostView';
import './PostApartmentPage.css';
import './ApartmentForm.css';
import './PostView.css';
import AlertHandler from './AlertHandler';
import ConfirmDialog from './ConfirmDialog';
import "./styles.css";

const labCredentials = config.labCredentials;
const accessKeyId = labCredentials.accessKeyId;
const secretAccessKey = labCredentials.secretAccessKey;
const sessionToken = labCredentials.sessionToken;
const region = labCredentials.region;

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  sessionToken: sessionToken,
  region: region,
});

const s3 = new AWS.S3();

const convertApartmentArrayToObject = (apartmentArray) => {
  return {
    post_id: apartmentArray[0],
    email: apartmentArray[1],
    city: apartmentArray[2],
    street: apartmentArray[3],
    number: apartmentArray[4],
    floor: apartmentArray[5],
    total_rooms: apartmentArray[6],
    appartment_size: apartmentArray[7],
    available_rooms: apartmentArray[8],
    num_of_toilets: apartmentArray[9],
    price: apartmentArray[10],
    post_bio: apartmentArray[11],
    has_parking: apartmentArray[12],
    has_elevator: apartmentArray[13],
    has_mamad: apartmentArray[14],
    num_of_roommates: apartmentArray[15],
    allow_pets: apartmentArray[16],
    has_balcony: apartmentArray[17],
    status: apartmentArray[18],
    has_sun_water_heater: apartmentArray[19],
    is_accessible_to_disabled: apartmentArray[20],
    has_air_conditioner: apartmentArray[21],
    has_bars: apartmentArray[22],
    entry_date: apartmentArray[23] ? new Date(apartmentArray[23]).toISOString().split('T')[0] : '',
    is_sublet: apartmentArray[24],
    end_date: apartmentArray[25] ? new Date(apartmentArray[25]).toISOString().split('T')[0] : '',
    photos: apartmentArray[26],
    roommate_emails: apartmentArray[27],
    creation_timestamp: apartmentArray[28] ? new Date(apartmentArray[28]).toISOString().split('T')[0] : ''
  };
};

function PostApartmentPage() {
  const { userEmail } = useContext(UserContext);
  const [apartments, setApartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newApartment, setNewApartment] = useState({
    city: '',
    street: '',
    number: '',
    floor: '',
    total_rooms: '',
    appartment_size: '',
    available_rooms: '',
    num_of_toilets: '',
    post_bio: '',
    has_parking: false,
    has_elevator: false,
    has_mamad: false,
    num_of_roommates: '',
    allow_pets: false,
    has_balcony: false,
    status: 'standard',
    has_sun_water_heater: false,
    is_accessible_to_disabled: false,
    has_air_conditioner: false,
    has_bars: false,
    entry_date: '',
    is_sublet: false,
    end_date: '',
    price: '',
    photos: [],
    roommate_emails: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [modalPhoto, setModalPhoto] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [alertHandlerOpen, setAlertHandlerOpen] = useState(false);
  const [alertHandlerMessage, setAlertHandlerMessage] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  const fetchApartments = async () => {
    try {
      const response = await fetch(`http://${config.serverPublicIP}:5433/user-apartments?email=${userEmail}`);
      if (response.ok) {
        const data = await response.json();
        const convertedData = data.map(convertApartmentArrayToObject);
        // Fetch roommate photos for each apartment
        const roommateEmails = Array.from(new Set(convertedData.flatMap(apartment => apartment.roommate_emails)));
        if (roommateEmails.length > 0) {
          const roommatePhotos = await fetchRoommatePhotos(roommateEmails);
          const apartmentsWithPhotos = convertedData.map(apartment => ({
            ...apartment,
            roommate_photos: apartment.roommate_emails.map(email => roommatePhotos[email] || '')
          }));
          setApartments(apartmentsWithPhotos);
        } else {
          setApartments(convertedData);
        }
      } else {
        console.error('Failed to fetch apartments');
      }
    } catch (error) {
      console.error('Error fetching apartments:', error);
    }
  };

  const fetchRoommatePhotos = async (emails) => {
    try {
      const response = await fetch(`http://${config.serverPublicIP}:5433/get-roommate-photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails }),
      });
      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to fetch roommate photos');
        return {};
      }
    } catch (error) {
      console.error('Error fetching roommate photos:', error);
      return {};
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewApartment((prevState) => ({ ...prevState, [name]: type === 'checkbox' ? checked : value }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (newApartment.photos.length + files.length > 10) {
      setAlertHandlerMessage("You can upload a maximum of 10 photos");
      setAlertHandlerOpen(true);
      return;
    }
    setNewApartment((prevState) => ({ ...prevState, photos: [...prevState.photos, ...files] }));

    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevState) => [...prevState, ...filePreviews]);

    // Reset the input value
    e.target.value = null;
  };

  const handleRemovePhoto = (index) => {
    setNewApartment((prevState) => ({
      ...prevState,
      photos: prevState.photos.filter((_, i) => i !== index),
    }));
    setImagePreviews((prevState) => prevState.filter((_, i) => i !== index));
  };

  const uploadToS3 = (file) => {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userEmail}_${Date.now()}.${fileExtension}`;
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

  const validateRoommateEmails = async (emails) => {
    try {
      const response = await fetch(`http://${config.serverPublicIP}:5433/validate-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails }),
      });
      const data = await response.json();
      if (data.invalid_emails.length > 0) {
        setAlertHandlerMessage(`The following emails are invalid: ${data.invalid_emails.join(', ')}`);
        setAlertHandlerOpen(true);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error validating emails:', error);
      return false;
    }
  };

  const validateFields = (apartment) => {
    const requiredFields = [
      'city', 'street', 'number', 'floor', 'total_rooms', 'appartment_size',
      'available_rooms', 'num_of_toilets', 'price', 'post_bio', 'num_of_roommates',
      'entry_date', 'status'
    ];
    for (let field of requiredFields) {
      if (!apartment[field]) {
        return `The field ${field} is required and cannot be empty`;
      }
    }
    return null;
  };

  const handlePostApartment = async () => {
    const { total_rooms, appartment_size, available_rooms, num_of_toilets, num_of_roomates, price, entry_date, end_date, is_sublet } = newApartment;

    if (total_rooms <= 0 || appartment_size <= 0 || available_rooms <= 0 || num_of_toilets <= 0 || num_of_roomates <= 0 || price <= 0) {
      setAlertHandlerMessage("All number fields must be positive");
      setAlertHandlerOpen(true);
      return;
    }

    if (is_sublet && new Date(end_date) <= new Date(entry_date)) {
      setAlertHandlerMessage("End date must be later than entry date for sublets");
      setAlertHandlerOpen(true);
      return;
    }

    if (apartments.length >= 10) {
      setAlertHandlerMessage("You can only upload up to 10 posts");
      setAlertHandlerOpen(true);
      return;
    }

    const validationError = validateFields(newApartment);
    if (validationError) {
      setAlertHandlerMessage(validationError);
      setAlertHandlerOpen(true);
      return;
    }

    // Add user's email if not already included
    if (!newApartment.roommate_emails.includes(userEmail)) {
      newApartment.roommate_emails.push(userEmail);
    }

    const areEmailsValid = await validateRoommateEmails(newApartment.roommate_emails);
    if (!areEmailsValid) return;

    const photoUrls = await Promise.all(newApartment.photos.map((file) => uploadToS3(file)));

    const formData = {
      ...newApartment,
      photos_url: photoUrls,
      email: userEmail,
      roommate_emails: JSON.stringify(newApartment.roommate_emails), // Ensure emails are stored as JSON string
      coordinates, // Add coordinates to the form data
    };

    try {
      const response = await fetch(`http://${config.serverPublicIP}:5433/post-apartment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.errorMessage) {
        console.log(`Error posting apartment: ${data.errorMessage}`);
      } else {
        setAlertHandlerMessage("Post was successfully created");
        setAlertHandlerOpen(true);
        setShowForm(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error posting apartment:', error);
    }
  };

  const handleUpdateApartment = async () => {
    const { total_rooms, appartment_size, available_rooms, num_of_toilets, num_of_roommates, price, entry_date, end_date, is_sublet } = newApartment;

    if (total_rooms <= 0 || appartment_size <= 0 || available_rooms <= 0 || num_of_toilets <= 0 || num_of_roommates <= 0 || price <= 0) {
      setAlertHandlerMessage("All number fields must be positive");
      setAlertHandlerOpen(true);
      return;
    }

    if (is_sublet && new Date(end_date) <= new Date(entry_date)) {
      setAlertHandlerMessage("End date must be later than entry date for sublets");
      setAlertHandlerOpen(true);
      return;
    }

    const validationError = validateFields(newApartment);
    if (validationError) {
      setAlertHandlerMessage(validationError);
      setAlertHandlerOpen(true);
      return;
    }

    // Add user's email if not already included
    if (!newApartment.roommate_emails.includes(userEmail)) {
      newApartment.roommate_emails.push(userEmail);
    }

    const areEmailsValid = await validateRoommateEmails(newApartment.roommate_emails);
    if (!areEmailsValid) return;

    let updatedPhotos = newApartment.photos.filter(photo => typeof photo === 'string');
    let newPhotos = newApartment.photos.filter(photo => typeof photo !== 'string');
    const newPhotoUrls = await Promise.all(newPhotos.map((file) => uploadToS3(file)));

    const formData = {
      ...newApartment,
      photos_url: [...updatedPhotos, ...newPhotoUrls],
      email: userEmail,
      post_id: editingPost.post_id,
      roommate_emails: JSON.stringify(newApartment.roommate_emails), // Ensure emails are stored as JSON string
      coordinates, // Add coordinates to the form data
    };

    try {
      const response = await fetch(`http://${config.serverPublicIP}:5433/update-apartment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.errorMessage) {
        console.log(`Error updating apartment: ${data.errorMessage}`);
      } else {
        await fetchApartments(); // Fetch apartments to update the list
        setShowForm(false);
        resetForm();
        setAlertHandlerMessage("Apartment was successfully updated");
        setAlertHandlerOpen(true);
      }
    } catch (error) {
      console.error('Error updating apartment:', error);
    }
  };

  const handleDeleteApartment = async (postId) => {
    try {
      const response = await fetch(`http://${config.serverPublicIP}:5433/delete-apartment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_id: postId, email: userEmail }),
      });

      const data = await response.json();
      if (data.errorMessage) {
        console.log(`Error deleting apartment: ${data.errorMessage}`);
      } else {
        await fetchApartments();
        setAlertHandlerMessage("Apartment was successfully deleted");
        setAlertHandlerOpen(true);
      }
    } catch (error) {
      console.error('Error deleting apartment:', error);
    }
  };

  const resetForm = () => {
    setNewApartment({
      city: '',
      street: '',
      number: '',
      floor: '',
      total_rooms: '',
      appartment_size: '',
      available_rooms: '',
      num_of_toilets: '',
      post_bio: '',
      has_parking: false,
      has_elevator: false,
      has_mamad: false,
      num_of_roommates: '',
      allow_pets: false,
      has_balcony: false,
      status: 'standard',
      has_sun_water_heater: false,
      is_accessible_to_disabled: false,
      has_air_conditioner: false,
      has_bars: false,
      entry_date: '',
      is_sublet: false,
      end_date: '',
      price: '',
      photos: [],
      roommate_emails: [],
    });
    setImagePreviews([]);
    setEditingPost(null); // Reset editing post
    setCoordinates({ lat: null, lng: null }); // Reset coordinates
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      resetForm();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handlePhotoClick = (src) => {
    setModalPhoto(src);
  };

  const handleManagePosts = async () => {
    setApartments([]); // Clear existing apartments to show a loading state
    await fetchApartments();
  };

  const handleSelectPost = (apartment) => {
    setEditingPost(apartment);
    setNewApartment({
      city: apartment.city || '',
      street: apartment.street || '',
      number: apartment.number || '',
      floor: apartment.floor || '',
      total_rooms: apartment.total_rooms || '',
      appartment_size: apartment.appartment_size || '',
      available_rooms: apartment.available_rooms || '',
      num_of_toilets: apartment.num_of_toilets || '',
      post_bio: apartment.post_bio || '',
      has_parking: apartment.has_parking || false,
      has_elevator: apartment.has_elevator || false,
      has_mamad: apartment.has_mamad || false,
      num_of_roommates: apartment.num_of_roommates || '',
      allow_pets: apartment.allow_pets || false,
      has_balcony: apartment.has_balcony || false,
      status: apartment.status || 'standard',
      has_sun_water_heater: apartment.has_sun_water_heater || false,
      is_accessible_to_disabled: apartment.is_accessible_to_disabled || false,
      has_air_conditioner: apartment.has_air_conditioner || false,
      has_bars: apartment.has_bars || false,
      entry_date: apartment.entry_date ? new Date(apartment.entry_date).toISOString().split('T')[0] : '',
      is_sublet: apartment.is_sublet || false,
      end_date: apartment.end_date ? new Date(apartment.end_date).toISOString().split('T')[0] : '',
      price: apartment.price || '',
      photos: apartment.photos || [],
      roommate_emails: apartment.roommate_emails || [],
    });
    setImagePreviews(apartment.photos || []);
    setShowForm(true);
    setCoordinates(apartment.coordinates || { lat: null, lng: null }); // Set coordinates if editing
  };

  const handleDeleteClick = (apartment) => {
    setPostToDelete(apartment);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteApartment(postToDelete.post_id);
    setConfirmDialogOpen(false);
    setPostToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setPostToDelete(null);
  };

  const handleCoordinatesChange = (newCoordinates) => {
    setCoordinates(newCoordinates);
  };

  return (

    <div className='container'>
      <div className="post-apartment-wrapper">
        <AlertHandler isOpen={alertHandlerOpen} message={alertHandlerMessage} onClose={() => setAlertHandlerOpen(false)} />
        <ConfirmDialog isOpen={confirmDialogOpen} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
            <HeaderButtons badgeContent={0} />
        <div className="post-apartment-container">
          {/* <div className='space'></div> */}
          <div className="content"><Logo /></div>
          <div className="post-apartment-content">
            <div className="post-apartment-buttonContainer">
              {!showForm && (
                <>
                  <button className="post-apartment-button addApartment" onClick={() => {
                    setEditingPost(null); // Ensure we're not in edit mode
                    setShowForm(true);
                  }}>
                    Add new apartment
                  </button>
                  <button className="post-apartment-button managePosts" onClick={handleManagePosts}>
                    Manage my posts
                  </button>
                </>
              )}
            </div>
            {showForm ? (
              <ApartmentForm
                apartment={newApartment}
                imagePreviews={imagePreviews}
                onChange={handleInputChange}
                onPhotoUpload={handlePhotoUpload}
                onRemovePhoto={handleRemovePhoto}
                onSubmit={editingPost ? handleUpdateApartment : handlePostApartment}
                onCancel={handleCancel}
                onCoordinatesChange={handleCoordinatesChange} // Pass the coordinates handler to the form
              />
            ) : (
              <PostView apartments={apartments} onSelect={handleSelectPost} onDelete={handleDeleteClick} />
            )}
          </div>
        </div>
        {modalPhoto && <PhotoModal src={modalPhoto} onClose={() => setModalPhoto(null)} />}
      </div>
    </div>
  );
}

const PhotoModal = ({ src, onClose }) => {
  return (
    <div className="photo-modal" onClick={onClose}>
      <div className="photo-modal-content">
        <img src={src} alt="Enlarged preview" className="photo-modal-image" />
      </div>
    </div>
  );
};

export default PostApartmentPage;
