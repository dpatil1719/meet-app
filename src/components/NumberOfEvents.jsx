import React, { useEffect, useState } from 'react';

const NumberOfEvents = ({ currentNOE = 32, setCurrentNOE, setErrorAlert }) => {
  const [input, setInput] = useState(String(currentNOE ?? 32));

  useEffect(() => {
    setInput(String(currentNOE ?? 32));
  }, [currentNOE]);

  const handleChange = (e) => {
    const raw = e.target.value;
    setInput(raw);

    if (raw === '') {
      // allow clearing while typing; don't update global state yet
      setErrorAlert?.('');
      return;
    }

    const n = Number(raw);

    if (Number.isNaN(n) || n <= 0) {
      setErrorAlert?.('Please enter a positive number.');
      return;
    }

    setErrorAlert?.('');
    setCurrentNOE?.(n);
  };

  return (
    <div id="number-of-events">
      <input
        type="number"
        className="number"
        aria-label="Number of events"
        placeholder="Number of events"
        value={input === '' ? '' : Number(input)}
        onChange={handleChange}
        min="1"
      />
    </div>
  );
};

export default NumberOfEvents;
