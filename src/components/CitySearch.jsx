import React, { useState } from 'react';

const CitySearch = ({ allLocations = [], setCurrentCity, setInfoAlert }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setQuery(value);

    const filtered = allLocations.filter((loc) =>
      loc.toUpperCase().includes(value.toUpperCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(true);

    if (value && filtered.length === 0) {
      setInfoAlert?.('We can not find the city you are looking for. Please try another city');
    } else {
      setInfoAlert?.('');
    }
  };

  const handleItemClicked = (event) => {
    const value = event.target.textContent;
    setQuery(value);
    setShowSuggestions(false);
    setCurrentCity?.(value);
    setInfoAlert?.('');
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
      {showSuggestions && (
        <ul className="suggestions">
          {suggestions.map((s) => (
            <li key={s} onClick={handleItemClicked}>
              {s}
            </li>
          ))}
          <li key="See all cities" onClick={handleItemClicked}>
            See all cities
          </li>
        </ul>
      )}
    </div>
  );
};

export default CitySearch;
