import { getEvents, extractLocations } from '../api';
import mockData from '../mock-data';

describe('api utilities', () => {
  test('extractLocations returns a unique, non-empty list', () => {
    const locations = extractLocations(mockData);
    expect(Array.isArray(locations)).toBe(true);
    expect(locations.length).toBeGreaterThan(0);
    expect(new Set(locations).size).toBe(locations.length); // uniqueness
  });

  test('getEvents returns mock data on localhost', async () => {
    // In JSDOM, window.location defaults to http://localhost
    const events = await getEvents();
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBe(mockData.length);
  });
});
