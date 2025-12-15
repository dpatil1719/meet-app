import React, { useState } from 'react';

const CitySearch = ({ allLocations = [] }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setQuery(value);
    const filtered = allLocations.filter((loc) =>
      loc.toUpperCase().includes(value.toUpperCase())
    );
    setSuggestions(filtered);
  };

  const handleItemClicked = (event) => {
    const value = event.target.textContent; // e.g., "Berlin, Germany"
    setQuery(value);
    setShowSuggestions(false); // hide list after selecting
  };

  return (
    <div id="city-search">
      <input
        type="text"
        className="city"
        placeholder="Search for a city"
        value={query}
        onFocus={() => setShowSuggestions(true)}
        onChange={handleInputChanged}
      />
      {showSuggestions ? (
        <ul className="suggestions">
          {suggestions.map((s) => (
            <li key={s} onClick={handleItemClicked}>
              {s}
            </li>
          ))}
          <li key="See all cities" onClick={handleItemClicked}>
            <b>See all cities</b>
          </li>
        </ul>
      ) : null}
    </div>
  );
};

export default CitySearch;
