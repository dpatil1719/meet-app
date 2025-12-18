import React from 'react';
import Event from './Event';

const EventList = ({ events }) => {
  const list = Array.isArray(events) ? events : [];

  // Do not render any loader here. If there are no events, render nothing.
  return (
    <ul className="EventList" aria-live="polite">
      {list.length > 0
        ? list.map((event) => <Event key={event.id} event={event} />)
        : null}
    </ul>
  );
};

export default EventList;
