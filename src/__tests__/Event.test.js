import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Event from '../components/Event';
import { getEvents } from '../api';

describe('<Event />', () => {
  let event;
  beforeAll(async () => {
    const all = await getEvents();
    // fallback in case mock data changes
    event = all[0] || {
      summary: 'Sample Event',
      created: '2020-01-01T00:00:00Z',
      location: 'Berlin, Germany',
      description: 'Sample description',
      htmlLink: 'https://example.com',
    };
  });

  test('renders summary, created, location, and the "Show details" button', () => {
    render(<Event event={event} />);
    expect(screen.getByText(event.summary)).toBeInTheDocument();
    expect(screen.getByText(event.created)).toBeInTheDocument();
    expect(screen.getByText(event.location)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show details/i })).toBeInTheDocument();
    expect(screen.queryByTestId('details')).not.toBeInTheDocument(); // collapsed by default
  });

  test('toggles details section on button click', async () => {
    const user = userEvent.setup();
    render(<Event event={event} />);

    // expand
    await user.click(screen.getByRole('button', { name: /show details/i }));
    expect(screen.getByTestId('details')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hide details/i })).toBeInTheDocument();

    // collapse
    await user.click(screen.getByRole('button', { name: /hide details/i }));
    expect(screen.queryByTestId('details')).not.toBeInTheDocument();
  });
});
