import React from 'react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from '../App';

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, (test) => {
  let AppComponent;
  let AppDOM;
  let EventListDOM;

  const openAppAndWaitForEvents = async () => {
    AppComponent = render(<App />);
    AppDOM = AppComponent.container.firstChild;
    EventListDOM = AppDOM.querySelector('#event-list');
    await waitFor(() => {
      const items = within(EventListDOM).queryAllByRole('listitem');
      expect(items.length).toBeGreaterThan(0);
    });
  };

  test('An event element is collapsed by default', ({ given, when, then }) => {
    given('the app is open', async () => {
      await openAppAndWaitForEvents();
    });

    when('the list of events is displayed', () => {
      // already ensured in given
    });

    then("each event's details are hidden by default", () => {
      const firstItem = within(EventListDOM).queryAllByRole('listitem')[0];
      expect(firstItem.querySelector('.details')).toBeNull();
    });
  });

  test('User can expand an event to see details', ({ given, and, when, then }) => {
    let firstItem;
    given('the app is open', async () => {
      await openAppAndWaitForEvents();
      firstItem = within(EventListDOM).queryAllByRole('listitem')[0];
    });

    and('the list of events is displayed', () => {
      expect(firstItem).toBeInTheDocument();
    });

    when('the user clicks the "Show details" button on an event', async () => {
      const user = userEvent.setup();
      const button = within(firstItem).getByRole('button', { name: /show details/i });
      await user.click(button);
    });

    then('that event\'s details are shown', () => {
      expect(within(firstItem).queryByTestId('details')).toBeInTheDocument();
    });
  });

  test('User can collapse an event to hide details', ({ given, and, when, then }) => {
    let firstItem;
    given('the app is open', async () => {
      await openAppAndWaitForEvents();
      firstItem = within(EventListDOM).queryAllByRole('listitem')[0];
    });

    and("an event's details are visible", async () => {
      const user = userEvent.setup();
      const showBtn = within(firstItem).getByRole('button', { name: /show details/i });
      await user.click(showBtn);
      expect(within(firstItem).queryByTestId('details')).toBeInTheDocument();
    });

    when('the user clicks the "Hide details" button on that event', async () => {
      const user = userEvent.setup();
      const hideBtn = within(firstItem).getByRole('button', { name: /hide details/i });
      await user.click(hideBtn);
    });

    then("that event's details are hidden", () => {
      expect(within(firstItem).queryByTestId('details')).not.toBeInTheDocument();
    });
  });
});
