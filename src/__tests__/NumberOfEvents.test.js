import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents />', () => {
  test('renders a textbox input', () => {
    const { queryByRole } = render(<NumberOfEvents />);
    const input = queryByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  test('default value is 32', () => {
    const { queryByRole } = render(<NumberOfEvents />);
    const input = queryByRole('textbox');
    expect(input).toHaveValue('32');
  });

  test('user can change the value', async () => {
    const user = userEvent.setup();
    const { queryByRole } = render(<NumberOfEvents />);
    const input = queryByRole('textbox');

    await user.clear(input);
    await user.type(input, '10');

    expect(input).toHaveValue('10');
  });
});
