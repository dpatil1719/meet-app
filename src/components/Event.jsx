import React, { useState } from 'react';

const Event = ({ event }) => {
  const [expanded, setExpanded] = useState(false);
  if (!event) return <li />;

  return (
    <li className="event">
      <div className="event-summary">
        <div>{event.summary}</div>
        <div>{event.created}</div>
        <div>{event.location}</div>
      </div>

      {expanded && (
        <div data-testid="details" className="event-details">
          {event.description && <p>{event.description}</p>}
          {event.htmlLink && (
            <p>
              <a href={event.htmlLink} target="_blank" rel="noreferrer">
                Event link
              </a>
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        {expanded ? 'Hide details' : 'Show details'}
      </button>
    </li>
  );
};

export default Event;
