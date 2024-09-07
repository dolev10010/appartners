import React, { useState, useEffect } from 'react';
import './styles.css';

const FilterMenu = ({ onFilter, currentSortOrder }) => {
  const [selectedOption, setSelectedOption] = useState(currentSortOrder || '');

  const handleFilter = (option) => {
    setSelectedOption(option);
    onFilter(option);
  };

  useEffect(() => {
    setSelectedOption(currentSortOrder);
  }, [currentSortOrder]);

  return (
    <div className="filter-menu">
      <ul>
        <li
          className={selectedOption === 'priceLowToHigh' ? 'selected' : ''}
          onClick={() => handleFilter('priceLowToHigh')}
        >
          Price - low to high
        </li>
        <li
          className={selectedOption === 'priceHighToLow' ? 'selected' : ''}
          onClick={() => handleFilter('priceHighToLow')}
        >
          Price - high to low
        </li>
        <li
          className={selectedOption === 'dateCloseToFar' ? 'selected' : ''}
          onClick={() => handleFilter('dateCloseToFar')}
        >
          Entry Date - Soonest First
        </li>
        <li
          className={selectedOption === 'dateFarToClose' ? 'selected' : ''}
          onClick={() => handleFilter('dateFarToClose')}
        >
          Entry Date - Farthest First
        </li>
      </ul>
    </div>
  );
};

export default FilterMenu;
