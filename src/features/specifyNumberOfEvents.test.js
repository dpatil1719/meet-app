import React from 'react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { getEvents } from '../api';

const feature = loadFeature('./src/features/specifyNumberOfEvents.feature');

defineFeature(feature, (test) => {
  let AppComponent;
  let AppDOM;
  let eventListDOM;
  let numberInput;

  const openApp = () => {
    AppComponent = render(<App />);
    AppDOM = AppComponent.container.firstChild;
    eventListDOM = AppDOM.querySelector('#event-list');

    const noeDOM = AppDOM.querySelector('#number-of-events');
    numberInput =
      within(noeDOM).queryByRole('spinbutton') ||
      within(noeDOM).getByRole('textbox');
  };

  test("When user hasn't set a number, 32 events are shown by default.", ({ given, when, then }) => {
    given('the app is open', () => {
      openApp();
    });

    when('the user has not changed the number of events', () => {
      // no action needed
    });

    then('the user should see 32 events in the list', async () => {
      const allEvents = await getEvents();
      const expected = Math.min(32, allEvents.length);

      await waitFor(() => {
        const items = within(eventListDOM).queryAllByRole('listitem');
        expect(items.length).toBe(expected);
      });
    });
  });

  test('User can change the number of events displayed.', ({ given, when, then }) => {
    given('the app is open', () => {
      openApp();
    });

    when(/^the user sets the number of events to "(.*)"$/, async (value) => {
      const user = userEvent.setup();
      await user.clear(numberInput);
      await user.type(numberInput, String(value));
    });

    then(/^the user should see (.*) events in the list$/, async (value) => {
      const allEvents = await getEvents();
      const expected = Math.min(Number(value), allEvents.length);

      await waitFor(() => {
        const items = within(eventListDOM).queryAllByRole('listitem');
        expect(items.length).toBe(expected);
      });
    });
  });

  test('User sees as many events as available if fewer than requested.', ({ given, when, then }) => {
    given('the app is open', () => {
      openApp();
    });

    when(/^the user sets the number of events to "(.*)"$/, async (value) => {
      const user = userEvent.setup();
      await user.clear(numberInput);
      await user.type(numberInput, String(value));
    });

    then('the user should see all available events', async () => {
      const allEvents = await getEvents();

      await waitFor(() => {
        const items = within(eventListDOM).queryAllByRole('listitem');
        expect(items.length).toBe(allEvents.length);
      });
    });
  });
});
