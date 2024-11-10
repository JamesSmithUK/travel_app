// CountryCheckbox.js
import React, { useState } from 'react';
import "./CountryCheckbox.css"

const CountryCheckbox = ({ countriesByContinent, visitedCountries, onCheckboxChange }) => {
    // State to track open/closed dropdowns
    const [openDropdowns, setOpenDropdowns] = useState({});

    const toggleDropdown = (continent) => {
        setOpenDropdowns(prevState => ({
            ...prevState,
            [continent]: !prevState[continent]
        }));
    };

    return (
        <div className="country-checkboxes">
            {Object.keys(countriesByContinent).map((continent, index) => (
                <div key={index} className="continent-section">
                    <div className="continent-header" onClick={() => toggleDropdown(continent)}>
                        <b>{continent}</b>
                    </div>
                    {openDropdowns[continent] && (
                        <div className="continent-countries">
                            {countriesByContinent[continent].map((country, idx) => (
                                <div key={idx} className="country-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={visitedCountries[country]}
                                        onChange={() => onCheckboxChange(country)}
                                    />
                                    <label>{country}</label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CountryCheckbox;
