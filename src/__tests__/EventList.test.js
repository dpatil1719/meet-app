import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventList from '../components/EventList';

describe('<EventList /> component', () => {
  test('has an element with "list" role', () => {
    const { queryByRole } = render(<EventList />);
    expect(queryByRole('list')).toBeInTheDocument();
  });
});

test('renders correct number of events', () => {
  const { getAllByRole } = render(<EventList events={[{}, {}, {}, {}]} />);
  expect(getAllByRole('listitem')).toHaveLength(4);
});
