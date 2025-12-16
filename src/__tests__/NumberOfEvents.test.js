import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents />', () => {
  test('renders a number input', () => {
    const { getByRole } = render(<NumberOfEvents />);
    const input = getByRole('spinbutton', { name: /number of events/i });
    expect(input).toBeInTheDocument();
  });

  test('default value is 32', () => {
    const { getByRole } = render(<NumberOfEvents />);
    const input = getByRole('spinbutton', { name: /number of events/i });
    expect(input).toHaveValue(32); // numeric for type="number"
  });

  test('user can change the value', async () => {
    const user = userEvent.setup();
    const setCurrentNOE = jest.fn();
    const { getByRole } = render(<NumberOfEvents setCurrentNOE={setCurrentNOE} />);
    const input = getByRole('spinbutton', { name: /number of events/i });

    await user.clear(input);
    await user.type(input, '10');

    expect(input).toHaveValue(10);       // numeric
    expect(setCurrentNOE).toHaveBeenLastCalledWith(10);
  });
});
