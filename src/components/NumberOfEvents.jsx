import React, { useEffect, useState } from 'react';

const NumberOfEvents = ({ currentNOE = 32, setCurrentNOE = () => {} }) => {
  const [value, setValue] = useState(currentNOE);

  // Keep local input in sync if parent changes it
  useEffect(() => {
    setValue(currentNOE);
  }, [currentNOE]);

  const onChange = (e) => {
    // accept only digits; keep as string so backspace works smoothly
    const next = e.target.value.replace(/[^\d]/g, '');
    setValue(next);
    // notify parent
    const n = parseInt(next || '0', 10);
    setCurrentNOE(Number.isNaN(n) ? 0 : n);
  };

  return (
    <div id="number-of-events">
      <input
        className="number"
        type="text"            /* keep role="textbox" for tests */
        value={`${value}`}
        onChange={onChange}
        aria-label="Number of events"
        placeholder="Number of events"
      />
    </div>
  );
};

export default NumberOfEvents;
