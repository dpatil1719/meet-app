import React, { useState, useEffect } from 'react';

export default function NumberOfEvents({ currentNOE = 32, setCurrentNOE }) {
  const [text, setText] = useState(String(currentNOE ?? 32));

  // keep the input in sync with parent state
  useEffect(() => {
    setText(String(currentNOE ?? 32));
  }, [currentNOE]);

  // allow only digits while typing; don't coerce mid–type
  const onChange = (e) => {
    const next = e.target.value;
    if (/^\d*$/.test(next)) {
      setText(next);
      if (next !== '') {
        const n = parseInt(next, 10);
        if (!Number.isNaN(n)) setCurrentNOE?.(n);
      }
    }
  };

  // clamp once the user finishes editing
  const onBlur = () => {
    let n = parseInt(text, 10);
    if (Number.isNaN(n)) n = 32;
    n = Math.max(1, Math.min(60, n));
    if (String(n) !== text) setText(String(n));
    setCurrentNOE?.(n);
  };

  return (
    <div id="number-of-events">
      <input
        type="text"            /* avoid number-input coercion */
        inputMode="numeric"
        pattern="\\d*"
        className="number"
        aria-label="Number of events"
        placeholder="Number of events"
        value={text}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
}
