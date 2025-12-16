import React, { useState, useEffect } from 'react';

const NumberOfEvents = ({ currentNOE = 32, setCurrentNOE }) => {
  const [number, setNumber] = useState(currentNOE ?? 32);

  useEffect(() => {
    // keep local field in sync if parent changes
    setNumber(currentNOE ?? 32);
  }, [`${currentNOE}`]);

  const handleChange = (e) => {
    const raw = e.target.value;
    setNumber(raw); // allow backspacing
    const n = Number(raw);
    if (setCurrentNOE) setCurrentNOE(Number.isNaN(n) ? 0 : n);
  };

  return (
    <div id="number-of-events">
      <input
        type="number"
        className="number"
        aria-label="Number of events"
        placeholder="Number of events"
        value={number}
        onChange={handleChange}
      />
    </div>
  );
};

export default NumberOfEvents;
