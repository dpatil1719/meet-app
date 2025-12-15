import React from 'react';
import Event from './Event';

const EventList = ({ events = [] }) => {
  return (
    <ul id="event-list">
      {events.map((event, idx) => (
        <Event key={idx} event={event} />
      ))}
    </ul>
  );
};

export default EventList;
