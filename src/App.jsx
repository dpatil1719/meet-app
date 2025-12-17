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
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');
  const [currentNOE, setCurrentNOE] = useState(32);

  // Alerts
  const [infoMsg, setInfoMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [warnMsg, setWarnMsg] = useState('');

  // Loading gate
  const [loading, setLoading] = useState(true);

  // Fetch all events once (mount)
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const evts = await getEvents();
        if (!alive) return;
        setAllEvents(evts || []);
        setAllLocations(extractLocations(evts || []));
      } catch (err) {
        if (!alive) return;
        setErrorMsg('Could not load events. Please refresh or try again later.');
        setAllEvents([]);
        setAllLocations([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Derive visible events and set the "Only X events..." info (but not while loading)
  useEffect(() => {
    const limit = Math.max(1, Math.min(60, parseInt(currentNOE, 10) || 32));

    const pool =
      currentCity === 'See all cities'
        ? allEvents
        : allEvents.filter((e) => e.location === currentCity);

    setEvents(pool.slice(0, limit));

    if (!loading) {
      setInfoMsg(limit > pool.length && pool.length >= 0
        ? `Only ${pool.length} events available. Showing all available.`
        : '');
    }
  }, [allEvents, currentCity, currentNOE, loading]);

  // Offline warning
  useEffect(() => {
    setWarnMsg(navigator.onLine ? '' : 'You are offline. Showing cached events (may be outdated).');
  }, [currentCity, currentNOE, loading]);

  return (
    <div className="App">
      <div className="alerts-container">
        {errorMsg && <ErrorAlert text={errorMsg} />}
        {warnMsg && <WarningAlert text={warnMsg} />}
        {!loading && infoMsg && <InfoAlert text={infoMsg} />}
      </div>

      <CitySearch
        allLocations={allLocations}
        setCurrentCity={setCurrentCity}
      />

      <label htmlFor="noe" className="sr-only">Number of events</label>
      <NumberOfEvents
        currentNOE={currentNOE}
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorMsg}
      />

      {loading && events.length === 0 ? (
        <p className="loading">Loading events...</p>
      ) : null}

      <EventList events={events} />
    </div>
  );
};

export default App;
