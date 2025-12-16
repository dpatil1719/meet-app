import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { getEvents, extractLocations } from './api';
import './App.css';

const App = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');

  // Fetch ONCE, cache all events
  useEffect(() => {
    (async () => {
      const evts = await getEvents();
      setAllEvents(evts);
      setAllLocations(extractLocations(evts));
    })();
  }, []);

  // Derive visible events whenever city or NOE changes
  useEffect(() => {
    const limit = Math.max(1, Math.min(60, parseInt(currentNOE, 10) || 32));
    const filtered =
      currentCity === 'See all cities'
        ? allEvents
        : allEvents.filter((e) => e.location === currentCity);
    setEvents(filtered.slice(0, limit));
  }, [allEvents, currentCity, currentNOE]);

  return (
    <div className="App">
      <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
      <NumberOfEvents currentNOE={currentNOE} setCurrentNOE={setCurrentNOE} />
      <EventList events={events} />
    </div>
  );
};

export default App;
