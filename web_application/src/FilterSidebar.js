import React, { useState, useEffect } from 'react';

const FilterSidebar = ({ onApplyFilters, onClose, initialFilters = {} }) => {
    const [filters, setFilters] = useState({
        city: initialFilters.city || '',
        priceMin: initialFilters.priceMin || '',
        priceMax: initialFilters.priceMax || '',
        hasParking: initialFilters.hasParking || false,
        hasElevator: initialFilters.hasElevator || false,
        hasBalcony: initialFilters.hasBalcony || false,
        isFurnished: initialFilters.isFurnished || false,
        hasAirConditioner: initialFilters.hasAirConditioner || false,
        allowPets: initialFilters.allowPets || false,
        hasSunWaterHeater: initialFilters.hasSunWaterHeater || false,
        isAccessibleToDisabled: initialFilters.isAccessibleToDisabled || false,
        hasMamad: initialFilters.hasMamad || false,
        hasBars: initialFilters.hasBars || false,
        keepKosher: initialFilters.keepKosher || false,
        renovated: initialFilters.renovated || false,
        status: initialFilters.status || '',
        entryDate: initialFilters.entryDate || '',
        ageMin: initialFilters.ageMin || '',
        ageMax: initialFilters.ageMax || '',
        profession: initialFilters.profession || '',
        smoking: initialFilters.smoking || '',
        likeAnimals: initialFilters.likeAnimals || '',
        hasAnimals: initialFilters.hasAnimals || '',
        keepsKosherRoommate: initialFilters.keepsKosherRoommate || false,
        gender: initialFilters.gender || '',
        allergies: initialFilters.allergies || '',
        hobbies: initialFilters.hobbies || '',
        relationshipStatus: initialFilters.relationshipStatus || '',
    });

    useEffect(() => {
        setFilters({
            city: initialFilters.city || '',
            priceMin: initialFilters.priceMin || '',
            priceMax: initialFilters.priceMax || '',
            hasParking: initialFilters.hasParking || false,
            hasElevator: initialFilters.hasElevator || false,
            hasBalcony: initialFilters.hasBalcony || false,
            isFurnished: initialFilters.isFurnished || false,
            hasAirConditioner: initialFilters.hasAirConditioner || false,
            allowPets: initialFilters.allowPets || false,
            hasSunWaterHeater: initialFilters.hasSunWaterHeater || false,
            isAccessibleToDisabled: initialFilters.isAccessibleToDisabled || false,
            hasMamad: initialFilters.hasMamad || false,
            hasBars: initialFilters.hasBars || false,
            keepKosher: initialFilters.keepKosher || false,
            renovated: initialFilters.renovated || false,
            status: initialFilters.status || '',
            entryDate: initialFilters.entryDate || '',
            ageMin: initialFilters.ageMin || '',
            ageMax: initialFilters.ageMax || '',
            profession: initialFilters.profession || '',
            smoking: initialFilters.smoking || '',
            likeAnimals: initialFilters.likeAnimals || '',
            hasAnimals: initialFilters.hasAnimals || '',
            keepsKosherRoommate: initialFilters.keepsKosherRoommate || false,
            gender: initialFilters.gender || '',
            allergies: initialFilters.allergies || '',
            hobbies: initialFilters.hobbies || '',
            relationshipStatus: initialFilters.relationshipStatus || '',
        });
    }, [initialFilters]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters({
            ...filters,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleClearField = (field) => {
        setFilters({
            ...filters,
            [field]: ''
        });
    };

    const handleSubmit = () => {
        onApplyFilters(filters);
    };

    return (
        <div className="filter-sidebar">
            <button className="close-button" onClick={onClose}>X</button>
            <div className="filter-sidebar-header">
                <h3>Filter Menu</h3>
            </div>
            <div className="filter-sidebar-content">
                <h5 className='filter-type-header'>Apartment Filters</h5>
                <div className="filter-group">
                    <label>City</label>
                    <div className="input-with-clear">
                        <input
                            type="text"
                            name="city"
                            value={filters.city}
                            onChange={handleChange}
                            className='filter-box'
                        />
                        {filters.city && (
                            <button className="clear-button" onClick={() => handleClearField('city')}>
                                X
                            </button>
                        )}
                    </div>
                </div>
                <div className="filter-group">
                    <label>Price Range (ILS)</label>
                    <div className="input-with-clear">
                        <input
                            type="number"
                            name="priceMin"
                            placeholder="Min"
                            value={filters.priceMin}
                            onChange={handleChange}
                            className='filter-box'
                        />
                        {filters.priceMin && (
                            <button className="clear-button" onClick={() => handleClearField('priceMin')}>
                                X
                            </button>
                        )}
                    </div>
                    <div className="input-with-clear">
                        <input
                            type="number"
                            name="priceMax"
                            placeholder="Max"
                            value={filters.priceMax}
                            onChange={handleChange}
                            className='filter-box'
                        />
                        {filters.priceMax && (
                            <button className="clear-button" onClick={() => handleClearField('priceMax')}>
                                X
                            </button>
                        )}
                    </div>
                </div>
                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            name="hasParking"
                            checked={filters.hasParking}
                            onChange={handleChange}
                            className='filter-checkBox'
                        />
                        Parking
                    </label>
                </div>
                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            name="hasElevator"
                            checked={filters.hasElevator}
                            onChange={handleChange}
                            className='filter-checkBox'
                        />
                        Elevator
                    </label>
                </div>
                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            name="hasBalcony"
                            checked={filters.hasBalcony}
                            onChange={handleChange}
                            className='filter-checkBox'
                        />
                        Balcony
                    </label>
                </div>
                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            name="isFurnished"
                            checked={filters.isFurnished}
                            onChange={handleChange}
                            className='filter-checkBox'
                        />
                        Furnished
                    </label>
                </div>
                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            name="hasAirConditioner"
                            checked={filters.hasAirConditioner}
                            onChange={handleChange}
                            className='filter-checkBox'
                        />
                        Air Conditioning
                    </label>
                </div>
                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            name="allowPets"
                            checked={filters.allowPets}
                            onChange={handleChange}
                            className='filter-checkBox'
                        />
                        Allow Pets
                    </label>
                </div>
                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            name="hasSunWaterHeater"
                            checked={filters.hasSunWaterHeater}
                            onChange={handleChange}
                            className='filter-checkBox'
                        />
                        Water Heater
                    </label>
                </div>
                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            name="isAccessibleToDisabled"
                            checked={filters.isAccessibleToDisabled}
                            onChange={handleChange}
                            className='filter-checkBox'
                        />
                        Accessible
                    </label>
                </div>
                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            name="hasMamad"
                            checked={filters.hasMamad}
                            onChange={handleChange}
                            className='filter-checkBox'
                        />
                        Mamad
                    </label>
                </div>
                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            name="hasBars"
                            checked={filters.hasBars}
                            onChange={handleChange}
                            className='filter-checkBox'
                        />
                        Bars
                    </label>
                </div>
                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            name="keepKosher"
                            checked={filters.keepKosher}
                            onChange={handleChange}
                            className='filter-checkBox'
                        />
                        Keep Kosher
                    </label>
                </div>
                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            name="renovated"
                            checked={filters.renovated}
                            onChange={handleChange}
                            className='filter-checkBox'
                        />
                        Renovated
                    </label>
                </div>
                <div className="filter-group">
                    <label>Entry Date</label>
                    <div className="input-with-clear">
                        <input
                            type="date"
                            name="entryDate"
                            value={filters.entryDate}
                            onChange={handleChange}
                            className='filter-box'
                        />
                        {filters.entryDate && (
                            <button className="clear-button" onClick={() => handleClearField('entryDate')}>
                                X
                            </button>
                        )}
                    </div>
                </div>
                <h5 className='filter-type-header'>Roommate Filters:</h5>
                <div className="filter-group">
                    <label>Minimum Age</label>
                    <input
                        type="number"
                        name="ageMin"
                        value={filters.ageMin}
                        onChange={handleChange}
                        className='filter-box'
                    />
                </div>
                <div className="filter-group">
                    <label>Maximum Age</label>
                    <input
                        type="number"
                        name="ageMax"
                        value={filters.ageMax}
                        onChange={handleChange}
                        className='filter-box'
                    />
                </div>
                <div className="filter-group">
                    <label>Profession</label>
                    <input
                        type="text"
                        name="profession"
                        value={filters.profession}
                        onChange={handleChange}
                        className='filter-box'
                    />
                </div>
                <div className="filter-group">
                    <label>Smoking</label>
                    <select name="smoking" value={filters.smoking} onChange={handleChange} className='filter-box'>
                        <option value="">Any</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Likes Animals</label>
                    <select className='filter-box' name="likeAnimals" value={filters.likeAnimals} onChange={handleChange}>
                        <option value="">Any</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Has Animals</label>
                    <select className='filter-box' name="hasAnimals" value={filters.hasAnimals} onChange={handleChange}>
                        <option value="">Any</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Keeps Kosher</label>
                    <select className='filter-box' name="keepsKosherRoommate" value={filters.keepsKosherRoommate} onChange={handleChange}>
                        <option value="">Any</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Gender</label>
                    <select className='filter-box' name="gender" value={filters.gender} onChange={handleChange}>
                        <option value="">Any</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Allergies</label>
                    <input
                        type="text"
                        name="allergies"
                        value={filters.allergies}
                        onChange={handleChange}
                        className='filter-box'
                    />
                </div>
                <div className="filter-group">
                    <label>Hobbies</label>
                    <input
                        type="text"
                        name="hobbies"
                        value={filters.hobbies}
                        onChange={handleChange}
                        className='filter-box'
                    />
                </div>
                <div className="filter-group">
                    <label>Relationship Status</label>
                    <select className='filter-box' name="relationshipStatus" value={filters.relationshipStatus} onChange={handleChange}>
                        <option value="">Any</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="in-relationship">In a Relationship</option>
                    </select>
                </div>
            </div>
            <div className="filter-sidebar-footer">
                <button className="entry-btn" onClick={handleSubmit}>Apply Filters</button>
            </div>
        </div>
    );
};

export default FilterSidebar;
