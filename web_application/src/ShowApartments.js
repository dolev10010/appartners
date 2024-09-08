import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from "./Logo";
import HeaderButtons from "./HeaderButtons";
import ApartmentCard from "./ApartmentCard";
import FilterMenu from './FilterMenu';
import FilterSidebar from './FilterSidebar';
import config from './config.json';
import { CiFilter } from "react-icons/ci";
import { TbArrowsSort } from "react-icons/tb";

function ShowApartments() {
  const navigate = useNavigate();
  const location = useLocation();

  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [filters, setFilters] = useState(location.state?.filters || {});
  const [sortOrder, setSortOrder] = useState(location.state?.sortOrder || '');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const filterButtonRef = useRef(null);

  const fetchApartments = async (sortOrder = '', filters = {}) => {
    try {
      const params = new URLSearchParams();

      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      if (sortOrder) {
        params.append('sortOrder', sortOrder);
      }

      const url = `http://${config.serverPublicIP}:5433/find-apartments?${params.toString()}`;
      const response = await fetch(url);

      if (response.status === 404) {
        setErrorMessage('No apartments found');
        setApartments([]);
      } else {
        const data = await response.json();
        setApartments(Array.isArray(data) && data.length > 0 ? data : []);
        setErrorMessage(''); // Clear error message if results found
      }
    } catch (error) {
      console.error("Failed to fetch apartments:", error);
      setApartments([]);
      setErrorMessage('There are no apartments to display that fits the filter');
    } finally {
      setLoading(false);
    }
  };

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
    setShowFilterSidebar(false);
  };

  const handleNavigateToDetails = (apartment) => {
    navigate('/apartment-details', { state: { apartment, filters, sortOrder } });
  };

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
            <button ref={filterButtonRef} className="sortButton" onClick={handleFilterClick}>
              <CiFilter />
            </button>
            <button className="filterButton" onClick={handleOpenSortMenu}>
              <TbArrowsSort />
            </button>
          </div>
          {showFilterMenu &&
            <FilterMenu
              onFilter={handleSort}
              currentSortOrder={sortOrder}
              style={{ top: filterButtonRef.current?.offsetHeight || 40 }}
            />
          }
        </div>
        <div className="middleFormBox">
          <div className="apartment-list">
            {errorMessage ? (
              <div className="error-message">{errorMessage}</div> // Display error message
            ) : (
              apartments.length > 0 ? (
                apartments.map((apartment, index) => (
                  <ApartmentCard
                    key={index}
                    apartment={apartment}
                    filters={filters}
                    sortOrder={sortOrder}
                    onNavigate={handleNavigateToDetails}
                  />
                ))
              ) : (
                <div></div>
              )
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