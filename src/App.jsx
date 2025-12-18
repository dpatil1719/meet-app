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

  // 1) Initial fetch with offline support
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        if (!navigator.onLine) {
          // Load from cache when offline
          const cached = localStorage.getItem('lastEvents');
          if (cached && !cancelled) {
            const parsed = JSON.parse(cached);
            setAllEvents(parsed);
            setAllLocations(extractLocations(parsed));
          }
        } else {
          // Online: fetch, then cache for future offline usage
          const evts = await getEvents();
          if (!cancelled && Array.isArray(evts)) {
            setAllEvents(evts);
            setAllLocations(extractLocations(evts));
            try {
              localStorage.setItem('lastEvents', JSON.stringify(evts));
            } catch {}
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => { cancelled = true; };
  }, []);

  // 2) Derive visible events + alerts
  useEffect(() => {
    if (loading || allEvents.length === 0) {
      setEvents([]);
      setInfoAlert('');
      setWarnAlert(navigator.onLine ? '' : 'You are offline. Showing cached events.');
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

      {/* If you still see any stray "Loading events..." text, it's coming from CSS/markup elsewhere. We no longer render a loader here. */}

      <EventList events={events} />
    </div>
  );
};

export default App;
