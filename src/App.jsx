import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { getEvents, extractLocations } from './api';
import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');

  const fetchData = async () => {
    const allEvents = await getEvents();
    const filtered =
      currentCity === 'See all cities'
        ? allEvents
        : allEvents.filter((e) => e.location === currentCity);
    setEvents(filtered.slice(0, currentNOE));
    setAllLocations(extractLocations(allEvents));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCity, currentNOE]);

  return (
    <div className="App">
      <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
      <NumberOfEvents currentNOE={currentNOE} setCurrentNOE={setCurrentNOE} />
      <EventList events={events} />
    </div>
  );
};

export default App;
