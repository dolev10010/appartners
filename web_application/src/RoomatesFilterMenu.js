import React, { useState, useEffect } from 'react';

const RoomatesFilterMenu = ({ onApplyFilters, onClose, initialFilters = {} }) => {
    const [filters, setFilters] = useState({
        ageMin: initialFilters.ageMin || '',
        ageMax: initialFilters.ageMax || '',
        profession: initialFilters.profession || '',
        smoking: initialFilters.smoking || '',
        likeAnimals: initialFilters.likeAnimals || '',
        hasAnimals: initialFilters.hasAnimals || '',
        keepsKosherRoommate: initialFilters.keepsKosherRoommate || '',
        gender: initialFilters.gender || '',
        allergies: initialFilters.allergies || '',
        hobbies: initialFilters.hobbies || '',
        relationshipStatus: initialFilters.relationshipStatus || '',
    });

    useEffect(() => {
        setFilters({
            ageMin: initialFilters.ageMin || '',
            ageMax: initialFilters.ageMax || '',
            profession: initialFilters.profession || '',
            smoking: initialFilters.smoking || '',
            likeAnimals: initialFilters.likeAnimals || '',
            hasAnimals: initialFilters.hasAnimals || '',
            keepsKosherRoommate: initialFilters.keepsKosherRoommate || '',
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
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: ''
        }));
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
                <div className="filter-group">
                    <label>Minimum Age</label>
                    <div className="input-with-clear">
                        <input
                            type="number"
                            name="ageMin"
                            value={filters.ageMin}
                            onChange={handleChange}
                            className='filter-box'
                        />
                        {filters.ageMin && (
                            <button className="clear-button" onClick={() => handleClearField('ageMin')}>
                                X
                            </button>
                        )}
                    </div>
                </div>

                <div className="filter-group">
                    <label>Maximum Age</label>
                    <div className="input-with-clear">
                        <input
                            type="number"
                            name="ageMax"
                            value={filters.ageMax}
                            onChange={handleChange}
                            className='filter-box'
                        />
                        {filters.ageMax && (
                            <button className="clear-button" onClick={() => handleClearField('ageMax')}>
                                X
                            </button>
                        )}
                    </div>
                </div>

                <div className="filter-group">
                    <label>Profession</label>
                    <div className="input-with-clear">
                        <input
                            type="text"
                            name="profession"
                            value={filters.profession}
                            onChange={handleChange}
                            className='filter-box'
                        />
                        {filters.profession && (
                            <button className="clear-button" onClick={() => handleClearField('profession')}>
                                X
                            </button>
                        )}
                    </div>
                </div>

                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            name="smoking"
                            checked={filters.smoking}
                            onChange={handleChange}
                            className='filter-checkBox'
                        />
                        Smoking
                    </label>
                    {filters.smoking && (
                        <button className="clear-button" onClick={() => handleClearField('smoking')}>
                        </button>
                    )}
                </div>

                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            name="likeAnimals"
                            checked={filters.likeAnimals}
                            onChange={handleChange}
                            className='filter-checkBox'
                        />
                        Likes Animals
                    </label>
                    {filters.likeAnimals && (
                        <button className="clear-button" onClick={() => handleClearField('likeAnimals')}>
                        </button>
                    )}
                </div>

                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            name="hasAnimals"
                            checked={filters.hasAnimals}
                            onChange={handleChange}
                            className='filter-checkBox'
                        />
                        Has Animals
                    </label>
                    {filters.hasAnimals && (
                        <button className="clear-button" onClick={() => handleClearField('hasAnimals')}>
                        </button>
                    )}
                </div>

                <div className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            name="keepsKosherRoommate"
                            checked={filters.keepsKosherRoommate}
                            onChange={handleChange}
                            className='filter-checkBox'
                        />
                        Keeps Kosher
                    </label>
                    {filters.keepsKosherRoommate && (
                        <button className="clear-button" onClick={() => handleClearField('keepsKosherRoommate')}>
                        </button>
                    )}
                </div>

                <div className="filter-group">
                    <label>Gender</label>
                    <div className="input-with-clear">
                        <select className='filter-box' name="gender" value={filters.gender} onChange={handleChange}>
                            <option value="">Any</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        {filters.gender && (
                            <button className="clear-button" onClick={() => handleClearField('gender')}>
                                X
                            </button>
                        )}
                    </div>
                </div>

                <div className="filter-group">
                    <label>Allergies</label>
                    <div className="input-with-clear">
                        <input
                            type="text"
                            name="allergies"
                            value={filters.allergies}
                            onChange={handleChange}
                            className='filter-box'
                        />
                        {filters.allergies && (
                            <button className="clear-button" onClick={() => handleClearField('allergies')}>
                                X
                            </button>
                        )}
                    </div>
                </div>

                <div className="filter-group">
                    <label>Hobbies</label>
                    <div className="input-with-clear">
                        <input
                            type="text"
                            name="hobbies"
                            value={filters.hobbies}
                            onChange={handleChange}
                            className='filter-box'
                        />
                        {filters.hobbies && (
                            <button className="clear-button" onClick={() => handleClearField('hobbies')}>
                                X
                            </button>
                        )}
                    </div>
                </div>

                <div className="filter-group">
                    <label>Relationship Status</label>
                    <div className="input-with-clear">
                        <select className='filter-box' name="relationshipStatus" value={filters.relationshipStatus} onChange={handleChange}>
                            <option value="">Any</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="in-relationship">In a Relationship</option>
                        </select>
                        {filters.relationshipStatus && (
                            <button className="clear-button" onClick={() => handleClearField('relationshipStatus')}>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="filter-sidebar-footer">
                <button className="entry-btn" onClick={handleSubmit}>Apply Filters</button>
            </div>
        </div>
    );
};

export default RoomatesFilterMenu;
