import React, { useEffect, useState } from 'react';

const NumberOfEvents = ({
  currentNOE,               // optional, parent-controlled value
  setCurrentNOE,            // optional, callback to parent
  setErrorAlert,            // optional, ErrorAlert setter from App
  setWarningAlert,          // optional, NOE-cap WarningAlert setter from App
  availableCount = 0,       // how many events exist for the current city
  hasLoaded = false         // true once events have been fetched at least once
}) => {
  // Local controlled value; init from prop or 32
  const [value, setValue] = useState(
    Number.isFinite(parseInt(currentNOE, 10)) ? parseInt(currentNOE, 10) : 32
  );

  // Keep local value in sync if parent changes currentNOE
  useEffect(() => {
    if (Number.isFinite(parseInt(currentNOE, 10))) {
      setValue(parseInt(currentNOE, 10));
    }
  }, [currentNOE]);

  const handleChange = (e) => {
    const raw = e.target.value;  // string from input
    // Allow empty while typing
    if (raw === '') {
      setValue('');
      if (setWarningAlert) setWarningAlert('');
      if (setErrorAlert) setErrorAlert('');
      return;
    }

    const num = Number(raw);

    // Validate numeric & positive
    if (Number.isNaN(num) || num <= 0) {
      setValue(raw);
      if (setErrorAlert) setErrorAlert('Please enter a positive number of events.');
      if (setWarningAlert) setWarningAlert('');
      return;
    }

    // Good value
    const n = Math.floor(num);

    // Clear error for valid input
    if (setErrorAlert) setErrorAlert('');

    // Only warn about availability after events have loaded
    if (hasLoaded && availableCount > 0 && n > availableCount) {
      if (setWarningAlert) {
        setWarningAlert(`Only ${availableCount} events are available for this city. Showing ${availableCount}.`);
      }
    } else {
      if (setWarningAlert) setWarningAlert('');
    }

    setValue(n);
    // Inform parent if provided
    if (setCurrentNOE) setCurrentNOE(n);
  };

  return (
    <div id="number-of-events" style={{ margin: '12px 0' }}>
      <label htmlFor="number-of-events-input" style={{ display: 'block', fontWeight: 600 }}>
        Number of events
      </label>
      <input
        id="number-of-events-input"
        className="number"
        type="number"
        aria-label="Number of events"
        min={1}
        // do not set max here; we let the app cap & warn instead
        value={value}
        onChange={handleChange}
        placeholder="Number of events"
        inputMode="numeric"
      />
      {/* helpful hint when no events yet */}
      {!hasLoaded && (
        <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '6px' }}>
        </div>
      )}
    </div>
  );
};

export default NumberOfEvents;
