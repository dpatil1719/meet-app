import mockData from './mock-data';

/**
 * Extract unique locations from events list.
 */
export const extractLocations = (events) => {
  const locations = events.map((e) => e.location);
  return [...new Set(locations)];
};

/**
 * For now, return mock data (later we’ll hit the auth server).
 */
export const getEvents = async () => {
  return mockData;
};
