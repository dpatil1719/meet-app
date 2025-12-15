import React from 'react';
import { render, within, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';

describe('<App /> component', () => {
  let AppDOM;

  beforeEach(() => {
    AppDOM = render(<App />).container.firstChild;
  });

  test('renders list of events', () => {
    expect(AppDOM.querySelector('#event-list')).toBeInTheDocument();
  });

  test('render CitySearch', () => {
    expect(AppDOM.querySelector('#city-search')).toBeInTheDocument();
  });
});

describe('<App /> integration — NumberOfEvents', () => {
  test('updates the rendered list length when the NumberOfEvents input changes', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    // Change NOE to 10 (clear "32" first)
    const noeBox = container.querySelector('#number-of-events input.number');
    await user.type(noeBox, '{backspace}{backspace}10');

    // Expected count is min(requested, available events)
    const allEvents = await getEvents();
    const expected = Math.min(10, allEvents.length);

    const eventListDOM = container.querySelector('#event-list');
    await waitFor(() => {
      const items = within(eventListDOM).queryAllByRole('listitem');
      expect(items.length).toBe(expected);
    });
  });
});
