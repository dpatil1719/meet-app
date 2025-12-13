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