import React, { useState, useEffect } from 'react';

const NumberOfEvents = ({ currentNOE = 32, setCurrentNOE }) => {
  const [number, setNumber] = useState(String(currentNOE ?? 32));

  useEffect(() => {
    setNumber(String(currentNOE ?? 32));
  }, [currentNOE]);

  const clamp = (n) => Math.max(1, Math.min(60, n)); // 1..60

  const handleChange = (e) => {
    // digits only
    const raw = e.target.value.replace(/[^\d]/g, '');
    if (raw === '') {
      setNumber('');
      return;
    }
    // normalize: drop leading zeros (e.g., "05" -> "5")
    const normalized = String(parseInt(raw, 10));
    setNumber(normalized);
    setCurrentNOE?.(clamp(parseInt(normalized, 10)));
  };

  const handleBlur = () => {
    const n = number === '' ? 1 : clamp(parseInt(number, 10));
    setNumber(String(n));
    setCurrentNOE?.(n);
  };

  // stop scroll/arrow from stepping into negatives
  const preventStep = (e) => {
    if (e.deltaY || e.key === 'ArrowDown') e.preventDefault();
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
        onBlur={handleBlur}
        onWheel={preventStep}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') e.preventDefault();
        }}
        min="1"
        max="60"
        inputMode="numeric"
        pattern="\d*"
      />
    </div>
  );
};

export default NumberOfEvents;
