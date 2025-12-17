import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { getEvents, extractLocations } from './api';
import { InfoAlert, ErrorAlert } from './components/Alert';
import './App.css';

const App = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');

  // NEW: alert texts
  const [infoAlert, setInfoAlert] = useState('');
  const [errorAlert, setErrorAlert] = useState('');

  // fetch once
  useEffect(() => {
    (async () => {
      const evts = await getEvents();
      setAllEvents(evts);
      setAllLocations(extractLocations(evts));
    })();
  }, []);

  // derive visible events
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
      {/* alerts container */}
      <div className="alerts-container">
        {infoAlert && <InfoAlert text={infoAlert} />}
        {errorAlert && <ErrorAlert text={errorAlert} />}
      </div>

      <CitySearch
        allLocations={allLocations}
        setCurrentCity={setCurrentCity}
        setInfoAlert={setInfoAlert}   // show "no city" info
      />

      <NumberOfEvents
        currentNOE={currentNOE}
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert} // show invalid number error
      />

      <EventList events={events} />
    </div>
  );
};

export default App;
