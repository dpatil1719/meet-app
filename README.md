# Meet App (React + Vite)

A React app for browsing upcoming events, built with Vite. This project follows **TDD/BDD** practices.

**Live site:** https://meet-app-lilac.vercel.app  
**Repo:** (this repo)

## Features (from the Project Brief)
1. Filter Events by City
2. Show/Hide Event Details
3. Specify Number of Events
4. Use the App When Offline (PWA)
5. Add an App Shortcut to the Home Screen
6. Display Charts Visualizing Event Details

---

## Feature 2: Show/Hide Event Details

**User Story**  
As a user, I should be able to expand an event to see its details and collapse it again, so that I can focus on the list and only open details when needed.

**Scenarios (Gherkin)**

**Scenario: Details are hidden by default**  
Given the list of events has been loaded  
When the user views the event list  
Then the details section of each event will be collapsed

**Scenario: User can expand an event to see details**  
Given the details for the event are collapsed  
When the user clicks the “Show details” button for that event  
Then the event element will expand and display its details (e.g., description, time, location)

**Scenario: User can hide an expanded event’s details**  
Given the details for an event are expanded  
When the user clicks the “Hide details” button for that event  
Then the event element will collapse and hide its details

**Scenario: Expanding one event does not affect others**  
Given multiple events are listed and one event is expanded  
When the user expands a different event  
Then both events can remain expanded independently (unless the design specifies otherwise)

---

---

## Feature 3: Specify Number of Events

**User Story**  
As a user, I should be able to choose how many events are shown in the list, so that I can control how much information I see at once.

**Scenarios (Gherkin)**

**Scenario: Default number of events is 32**  
Given the user has not set a custom number of events  
When the event list loads  
Then up to 32 events will be displayed by default

**Scenario: User can change the number of events shown**  
Given the event list is visible  
When the user enters “10” in the “Number of events” input  
Then the list will update to show up to 10 events

**Scenario: Invalid values are handled gracefully**  
Given the event list is visible  
When the user enters an invalid value (e.g., empty, text, 0, or a negative number) in the “Number of events” input  
Then a validation message will be shown  
And the number of events will remain at the last valid value (or the default 32 if none was set)

**Scenario: Large values cap at available events**  
Given there are fewer events available than the number requested  
When the user requests a higher number than available  
Then the list will show only the available events

--

## Feature 4: Use the App When Offline

**User Story**  
As a user, I should be able to view the app and previously loaded events while offline, so that I can still browse information without an internet connection.

**Scenarios (Gherkin)**

**Scenario: Show an offline indicator when the connection is lost**  
Given the app is online and showing events  
When the device goes offline  
Then an “Offline” indicator is shown  
And the current list of events remains visible

**Scenario: Open the app offline with cached data**  
Given the user previously used the app online and event data was cached  
When the user opens the app while offline  
Then the app shows the last cached list of events  
And a note explains that data may be outdated while offline

**Scenario: Network-dependent actions are disabled offline**  
Given the user is offline  
When the user tries to search for a new city or refresh events  
Then the action is prevented  
And a message explains that an internet connection is required

**Scenario: Sync when connection is restored**  
Given the user is offline and viewing cached events  
When the device comes back online  
Then the app fetches the latest events  
And the offline indicator disappears

**Scenario: No cache available while offline**  
Given the user has never loaded events before  
And the device is offline  
When the user opens the app  
Then the app shows an informative message that no data is available yet

---

## Feature 5: Add an App Shortcut to the Home Screen (PWA)

**User Story**  
As a user, I should be able to install the app to my home screen so that I can launch it like a native app.

> Note: Installability and the install prompt are **browser/OS-controlled**. These scenarios are usually verified manually.

**Scenarios (Gherkin)**

**Scenario: App is installable when PWA criteria are met**  
Given the app is served over HTTPS and includes a valid web app manifest and service worker  
When the user visits the app in a supported browser  
Then the browser marks the app as installable

**Scenario: Browser shows an install option**  
Given the app is installable  
When the user opens the browser’s “Install” / “Add to Home Screen” option (or sees an install prompt)  
Then the user can install the app

**Scenario: Installed app launches from home screen**  
Given the app has been installed  
When the user opens it from the home screen/app list  
Then it launches in a standalone window and loads cached assets if offline

**Scenario: Uninstall removes the shortcut**  
Given the app is installed  
When the user uninstalls it from the OS/home screen  
Then the app’s shortcut is removed

## Tech Stack
- React + Vite
- Jest (unit/integration tests)
- Cucumber (BDD)
- (Later) Service Worker / PWA features
- (Later) Charting for data viz

## Local Dev
```bash
npm install
npm run dev