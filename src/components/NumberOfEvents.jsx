import React, { useState } from 'react';

const NumberOfEvents = () => {
  const [count, setCount] = useState('32'); // default as a string to match the test

  return (
    <div id="number-of-events">
      <input
        type="text"
        aria-label="Number of events"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />
    </div>
  );
};

export default NumberOfEvents;
