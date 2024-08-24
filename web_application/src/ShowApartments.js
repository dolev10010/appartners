import React, { useEffect, useState, useRef } from "react";
import Logo from "./Logo";
import HeaderButtons from "./HeaderButtons";
import ApartmentCard from "./ApartmentCard";
import FilterMenu from './FilterMenu';
import FilterSidebar from './FilterSidebar';
import config from './config.json';
import { CiFilter } from "react-icons/ci";
import { TbArrowsSort } from "react-icons/tb";
import { useLocation, useNavigate } from 'react-router-dom';

function ShowApartments() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [filters, setFilters] = useState(location.state?.filters || {});
  const [sortOrder, setSortOrder] = useState(location.state?.sortOrder || '');
  const filterButtonRef = useRef(null); 

  const fetchApartments = async (sortOrder = '', filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (sortOrder) params.append('sortOrder', sortOrder);
      if (filters.priceMin) params.append('priceMin', filters.priceMin);
      if (filters.priceMax) params.append('priceMax', filters.priceMax);
      if (filters.city) params.append('city', filters.city);
      if (filters.hasParking) params.append('hasParking', filters.hasParking);
      if (filters.hasElevator) params.append('hasElevator', filters.hasElevator);
      if (filters.hasBalcony) params.append('hasBalcony', filters.hasBalcony);
      if (filters.isFurnished) params.append('isFurnished', filters.isFurnished);
      if (filters.hasAirConditioner) params.append('hasAirConditioner', filters.hasAirConditioner);
      if (filters.allowPets) params.append('allowPets', filters.allowPets);
      if (filters.hasSunWaterHeater) params.append('hasSunWaterHeater', filters.hasSunWaterHeater);
      if (filters.isAccessibleToDisabled) params.append('isAccessibleToDisabled', filters.isAccessibleToDisabled);
      if (filters.hasMamad) params.append('hasMamad', filters.hasMamad);
      if (filters.hasBars) params.append('hasBars', filters.hasBars);
      if (filters.keepKosher) params.append('keepKosher', filters.keepKosher);
      if (filters.status) params.append('status', filters.status);
      if (filters.entryDate) params.append('entryDate', filters.entryDate);
      if (filters.ageMin) params.append('ageMin', filters.ageMin);
      if (filters.ageMax) params.append('ageMax', filters.ageMax);
      if (filters.profession) params.append('profession', filters.profession);
      if (filters.smoking) params.append('smoking', filters.smoking);
      if (filters.likeAnimals) params.append('likeAnimals', filters.likeAnimals);
      if (filters.hasAnimals) params.append('hasAnimals', filters.hasAnimals);
      if (filters.keepsKosherRoommate) params.append('keepsKosherRoommate', filters.keepsKosherRoommate);
      if (filters.gender) params.append('gender', filters.gender);
      if (filters.allergies) params.append('allergies', filters.allergies);
      if (filters.hobbies) params.append('hobbies', filters.hobbies);
      if (filters.relationshipStatus) params.append('relationshipStatus', filters.relationshipStatus);
      
      const url = `http://${config.serverPublicIP}:5433/find-apartments?${params.toString()}`;
      
      const response = await fetch(url);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setApartments(data);
      } else {
        console.error("No apartments found or data format is incorrect:", data);
        setApartments([]);
      }
    } catch (error) {
      console.error("Failed to fetch apartments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch apartments when component mounts or when filters/sortOrder change
  useEffect(() => {
    fetchApartments(sortOrder, filters);
  }, [sortOrder, filters]);

  const handleSort = (type) => {
    setSortOrder(type);
    setShowFilterMenu(false);
  };

  const handleFilterClick = () => {
    setShowFilterSidebar(true);
  };

  const handleOpenSortMenu = () => {
    setShowFilterMenu(!showFilterMenu);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilterSidebar(false); // Close the sidebar after applying filters
  };

  const handleNavigateToDetails = (apartment) => {
    navigate('/apartment-details', { state: { apartment, filters, sortOrder } });
  };

  const handleBackClick = () => {
    navigate(-1, { state: { filters, sortOrder } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="createProfileBackground"></div>
      <div className="backgroundImageMobile"></div>
      <div className="image-container">
        <HeaderButtons badgeContent={4} />
      </div>
      <div className="content">
        <Logo />
        <div className="formRowEdit">
          <h3 className="pageName">Show Apartments</h3>
          <div className="icon-buttons">
            <button 
              ref={filterButtonRef} 
              className="sortButton" 
              onClick={handleFilterClick}>
              <CiFilter />
            </button>
            <button className="filterButton" onClick={handleOpenSortMenu}>
              <TbArrowsSort />
            </button>
          </div>
          {showFilterMenu && 
            <FilterMenu 
              onFilter={handleSort} 
              style={{ top: filterButtonRef.current?.offsetHeight || 40 }}
            />
          }
        </div>
        <div className="middleFormBox">
          <div className="apartment-list">
            {apartments.length > 0 ? (
              apartments.map((apartment, index) => (
                <ApartmentCard 
                  key={index} 
                  apartment={apartment} 
                  filters={filters} 
                  sortOrder={sortOrder}
                />
              ))
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
      {showFilterSidebar && 
        <FilterSidebar 
          onApplyFilters={handleApplyFilters} 
          onClose={() => setShowFilterSidebar(false)} 
          initialFilters={filters}
        />
      }
    </div>
  );
}

export default ShowApartments;


/* 
במצב טאצ רק 50# מסך לתפריט פילטר
לוודא שאם חזרתי אחורה לדף הזה עם הכפתור הסינון/מיון נשארו
*/