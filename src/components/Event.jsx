import React, { useState } from 'react';

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  const title = event?.summary || 'Untitled event';
  // ✅ show start dateTime/date, or fallback to created
  const when = event?.start?.dateTime || event?.start?.date || event?.created || '';
  const location = event?.location || '';
  const link = event?.htmlLink || event?.link || '';
  const description =
    typeof event?.description === 'string' && event.description.trim().length > 0
      ? event.description
      : 'No description available.';

  return (
    <li className="event">
      <h3>{title}</h3>
      <p>{when}</p>
      <p>{location}</p>

      {showDetails && (
        <div className="details" data-testid="details">
          {link && (
            <a href={link} target="_blank" rel="noreferrer">Event link</a>
          )}
          <p className="description">{description}</p>
        </div>
      )}

      <button
        type="button"
        className="details-btn"
        onClick={() => setShowDetails(prev => !prev)}
      >
        {showDetails ? 'Hide details' : 'Show details'}
      </button>
    </li>
  );
};

export default Event;
