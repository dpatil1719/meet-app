import React, { useEffect, useState } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { getEvents, extractLocations } from './api';
import { InfoAlert, ErrorAlert, WarningAlert } from './components/Alert';
import './App.css';

const App = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');

  const [infoAlert, setInfoAlert] = useState('');
  const [errorAlert, setErrorAlert] = useState('');
  const [warnAlert, setWarnAlert] = useState('');
  const [loading, setLoading] = useState(true); // first-load only

  // Fetch ONCE
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const evts = await getEvents();
        if (cancelled) return;
        setAllEvents(evts);
        setAllLocations(extractLocations(evts));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Derive visible events + alerts
  useEffect(() => {
    if (loading || allEvents.length === 0) {
      setEvents([]);
      setInfoAlert('');
      return;
    }

    setWarnAlert(navigator.onLine ? '' : 'You are offline. Showing cached events.');

    const limit = Math.max(1, Math.min(60, parseInt(currentNOE, 10) || 32));
    const base =
      currentCity === 'See all cities'
        ? allEvents
        : allEvents.filter((e) => e.location === currentCity);

    setEvents(base.slice(0, limit));

    if (limit > base.length) {
      setInfoAlert(`Only ${base.length} events available. Showing all available.`);
    } else {
      setInfoAlert('');
    }
  }, [allEvents, currentCity, currentNOE, loading]);

  return (
    <div className="App">
      <div className="alerts-container">
        <InfoAlert text={infoAlert} />
        <ErrorAlert text={errorAlert} />
        <WarningAlert text={warnAlert} />
      </div>

      <CitySearch
        allLocations={allLocations}
        setCurrentCity={setCurrentCity}
        setErrorAlert={setErrorAlert}
      />

      <NumberOfEvents
        currentNOE={currentNOE}
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />

      <EventList events={events} isLoading={loading} />
    </div>
  );
};

export default App;
