import React, { useEffect, useMemo, useState } from 'react';
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

  // alerts
  const [infoMsg, setInfoMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [warningMsg, setWarningMsg] = useState('');

  // loading + first fetch completion
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false); // becomes true after first fetch completes

  // First load: fetch events (your api.js already handles localStorage/offline)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const evts = (await getEvents()) || [];
        if (cancelled) return;
        setAllEvents(evts);
        setAllLocations(extractLocations(evts));
      } catch (e) {
        if (cancelled) return;
        setErrorMsg('Could not load events. Please try again.');
        setAllEvents([]);
        setAllLocations([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setReady(true); // mark that our first fetch finished (even if it returned 0)
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // derive filtered list + limit
  const limit = useMemo(
    () => Math.max(1, Math.min(60, parseInt(currentNOE, 10) || 32)),
    [currentNOE]
  );

  const filtered = useMemo(() => {
    return currentCity === 'See all cities'
      ? allEvents
      : allEvents.filter((e) => e.location === currentCity);
  }, [allEvents, currentCity]);

  useEffect(() => {
    setEvents(filtered.slice(0, limit));
  }, [filtered, limit]);

  const totalAvailable = filtered.length;

  // InfoAlert: only AFTER first fetch is done AND there are events to compare against
  useEffect(() => {
    if (ready && totalAvailable > 0 && limit > totalAvailable) {
      setInfoMsg(`Only ${totalAvailable} events available. Showing all available.`);
    } else {
      setInfoMsg('');
    }
  }, [ready, totalAvailable, limit]);

  // Offline warning per lesson
  useEffect(() => {
    setWarningMsg(
      navigator.onLine
        ? ''
        : 'You are offline. Showing cached events (may be outdated).'
    );
  }, [currentCity, currentNOE]);

  return (
    <div className="App">
      <div className="alerts-container" aria-live="polite">
        {warningMsg && <WarningAlert text={warningMsg} />}
        {errorMsg && <ErrorAlert text={errorMsg} />}
        {/* extra guard: never show the info alert unless some events are actually on screen */}
        {infoMsg && events.length > 0 && <InfoAlert text={infoMsg} />}
      </div>

      <CitySearch
        allLocations={allLocations}
        setCurrentCity={setCurrentCity}
        setErrorAlert={setErrorMsg}
      />

      <NumberOfEvents
        currentNOE={currentNOE}
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorMsg}
      />

      {/* show loading helper only if nothing is rendered yet */}
      {loading && events.length === 0 && (
        <p role="status" style={{ opacity: 0.8, textAlign: 'center', marginTop: 8 }}>
          Loading events…
        </p>
      )}

      <EventList events={events} />
    </div>
  );
};

export default App;
