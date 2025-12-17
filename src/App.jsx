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

  // Alerts
  const [infoAlert, setInfoAlert] = useState('');
  const [errorAlert, setErrorAlert] = useState('');

  // Fetch once, cache all events + locations
  useEffect(() => {
    (async () => {
      const evts = await getEvents();
      setAllEvents(evts);
      setAllLocations(extractLocations(evts));
    })();
  }, []);

  // Derive visible events whenever city or NOE changes
  useEffect(() => {
    const filtered =
      currentCity === 'See all cities'
        ? allEvents
        : allEvents.filter((e) => e.location === currentCity);

    const available = filtered.length;

    const parsed = parseInt(currentNOE, 10);
    const desired = Number.isFinite(parsed) ? parsed : 32;

    // Final limit: at least 1, at most 60, and never more than available
    const limit = Math.max(1, Math.min(60, Math.min(desired, available)));

    // If user asked for more than available, show a friendly error
    if (desired > available) {
      const suffix = currentCity === 'See all cities' ? '' : ' for this city';
      setErrorAlert(
        `Only ${available} event${available === 1 ? '' : 's'} available${suffix}. Showing all available.`
      );
    } else {
      // Only clear the "Only X events..." message; keep other error types from NumberOfEvents
      setErrorAlert((prev) => (prev.startsWith('Only ') ? '' : prev));
    }

    setEvents(filtered.slice(0, limit));
  }, [allEvents, currentCity, currentNOE]);

  return (
    <div className="App">
      <div className="alerts-container">
        {infoAlert.length ? <InfoAlert text={infoAlert} /> : null}
        {errorAlert.length ? <ErrorAlert text={errorAlert} /> : null}
      </div>

      <CitySearch
        allLocations={allLocations}
        setCurrentCity={setCurrentCity}
        setInfoAlert={setInfoAlert}
      />

      <NumberOfEvents
        currentNOE={currentNOE}
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />

      <EventList events={events} />
    </div>
  );
};

export default App;
