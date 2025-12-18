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
  const [loading, setLoading] = useState(true); // only for first load

  // 1) Fetch ONCE (first load only). No "0 events" flash.
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

  // 2) Derive visible events whenever filters or source change.
  useEffect(() => {
    // Don’t compute alerts while initial data hasn’t arrived yet.
    if (allEvents.length === 0) {
      setEvents([]);
      return;
    }

    // Offline warning (from the lesson)
    setWarnAlert(navigator.onLine ? '' : 'You are offline. Showing cached events.');

    const limit = Math.max(1, Math.min(60, parseInt(currentNOE, 10) || 32));
    const base =
      currentCity === 'See all cities'
        ? allEvents
        : allEvents.filter((e) => e.location === currentCity);

    setEvents(base.slice(0, limit));

    // Info alert after we know counts (prevents the 0-flash)
    if (limit > base.length) {
      setInfoAlert(`Only ${base.length} events available. Showing all available.`);
    } else {
      setInfoAlert('');
    }
  }, [allEvents, currentCity, currentNOE]);

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

      {/* Remove duplicate label in App; NumberOfEvents handles its own label/accessibility */}
      <NumberOfEvents
        currentNOE={currentNOE}
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />

      {/* Show loader ONLY before first successful fetch */}
      {loading && events.length === 0 && (
        <div className="loading" style={{ textAlign: 'center', opacity: 0.7 }}>
          Loading events…
        </div>
      )}

      <EventList events={events} />
    </div>
  );
};

export default App;
