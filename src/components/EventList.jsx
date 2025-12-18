import React from 'react';
import Event from './Event';

const EventList = ({ events = [], isLoading = false }) => {
  // Show loader ONLY while loading and nothing to show yet
  if (isLoading && events.length === 0) {
    return <p className="loading" aria-live="polite">Loading events...</p>;
  }

  // If not loading and empty, render nothing (or an empty state if you want)
  if (!isLoading && events.length === 0) {
    return null;
  }

  return (
    <ul className="EventList">
      {events.map((event) => (
        <li key={event.id}>
          <Event event={event} />
        </li>
      ))}
    </ul>
  );
};

export default EventList;
