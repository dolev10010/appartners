import React from 'react';

const FilterMenu = ({ onFilter }) => {
  return (
    <div className="filter-menu">
      <ul>
        <li onClick={() => onFilter('priceHighToLow')}>Price - low to high</li>
        <li onClick={() => onFilter('priceLowToHigh')}>Price - high to low</li>
        <li onClick={() => onFilter('dateNewToOld')}>Entry Date - Soonest First</li>
        <li onClick={() => onFilter('dateOldToNew')}>Entry Date - Farthest First</li>
      </ul>
    </div>
  );
};

export default FilterMenu;
