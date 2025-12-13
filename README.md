# Meet App (Vite + React)

A simple events app used to practice TDD/BDD. Users can filter events by city, view/hide details, choose how many events to see, work offline, install the app, and view charts.

- **Live site:** https://meet-app-lilac.vercel.app/
- **Repo:** https://github.com/dpatil1719/meet-app

## Tech
- React + Vite
- Jest + Testing Library (later in the module)
- BDD scenarios in Gherkin style
- Deployed on Vercel

---

## User Stories

**Feature 1 – Filter Events by City**  
As a user, I should be able to filter events by city so that I can see events happening in a specific place.

**Feature 2 – Show/Hide Event Details**  
As a user, I should be able to expand or collapse an event’s details so that I can quickly scan or dive deeper.

**Feature 3 – Specify Number of Events**  
As a user, I should be able to choose how many events are shown so that I can control the length of the list.

**Feature 4 – Use the App When Offline**  
As a user, I want the app to keep working offline so that I can still see recently viewed events without internet.

**Feature 5 – Add App Shortcut to Home Screen**  
As a user, I want to add the app to my device’s home screen so that it feels like a native app. *(Handled by the OS; testing is limited.)*

**Feature 6 – Display Charts Visualizing Event Details**  
As a user, I want to see charts that summarize events so that I can understand trends at a glance.

---

## Gherkin Scenarios

### Feature 1: Filter Events by City
**Scenario 1: Show all events by default**  
**Given** the user has not searched for any city  
**When** the user opens the app  
**Then** the app should show a list of upcoming events from all cities

**Scenario 2: See suggestions when typing a city**  
**Given** the main page is open  
**When** the user starts typing in the city textbox  
**Then** the user should see a list of matching city suggestions

**Scenario 3: Select a city from suggestions**  
**Given** the user is typing “Berlin” and suggestions are visible  
**When** the user selects “Berlin, Germany”  
**Then** the app should set the filter to “Berlin, Germany” **and** show upcoming events in that city

---

### Feature 2: Show/Hide Event Details
**Scenario 1: Event details are collapsed by default**  
**Given** the event list is loaded  
**When** the page finishes rendering  
**Then** each event’s details should be hidden

**Scenario 2: Expand details**  
**Given** an event’s details are hidden  
**When** the user clicks “Show details”  
**Then** the event’s detailed info should be displayed

**Scenario 3: Collapse details**  
**Given** an event’s details are visible  
**When** the user clicks “Hide details”  
**Then** the event’s detailed info should be hidden

---

### Feature 3: Specify Number of Events
**Scenario 1: Default to 32 events**  
**Given** the user has not changed the events count  
**When** the event list loads  
**Then** up to 32 events should be shown

**Scenario 2: User changes number of events**  
**Given** the event list is visible  
**When** the user enters “10” in the “Number of events” input  
**Then** the list should update to show up to 10 events

**Scenario 3: Handle invalid values**  
**Given** the user enters an invalid value (e.g., negative or non-numeric)  
**When** the value is submitted  
**Then** the app should show a helpful message **and** keep the previous valid count

---

### Feature 4: Use the App When Offline
**Scenario 1: See cached events offline**  
**Given** the user has previously loaded events online  
**And** the device is now offline  
**When** the user opens the app  
**Then** the app should show the last cached list of events

**Scenario 2: Show offline indicator**  
**Given** the device is offline  
**When** the user views the app  
**Then** the app should display an “Offline” badge or message

**Scenario 3: Prevent failing fetches**  
**Given** the device is offline  
**When** the app attempts to refresh events  
**Then** the app should fail gracefully and keep cached data

---

### Feature 5: Add App Shortcut to Home Screen (PWA)
*(OS-controlled; limited testing)*

**Scenario 1: Show install prompt when eligible**  
**Given** the app meets install criteria  
**When** the browser triggers the install prompt  
**Then** the user should be able to add the app to the home screen

**Scenario 2: Installed app launches full-screen**  
**Given** the user has installed the app  
**When** the user opens it from the home screen  
**Then** the app should launch with an installed/PWA experience

---

### Feature 6: Display Charts Visualizing Event Details
**Scenario 1: Events by city chart**  
**Given** events have been loaded  
**When** the user views the dashboard  
**Then** a chart should display the number of events per city

**Scenario 2: Charts respond to filters**  
**Given** a city filter is active  
**When** the user changes the selected city  
**Then** the charts should update to reflect the filtered events

**Scenario 3: Event genres distribution**  
**Given** events include multiple genres  
**When** the user views the genres chart  
**Then** it should visualize the count per genre

---