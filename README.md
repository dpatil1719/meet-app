# Meet App (PWA) — React + Vite

A serverless, test-driven events app that authenticates with Google Calendar, works offline (PWA), and visualizes data with Recharts.

## Live Links
- **Deployed app (Vercel):** https://meet-app-lilac.vercel.app/
- **GitHub repo:** https://github.com/dpatil1719/meet-app

## Key Features
1. **Filter events by city** (autocomplete with suggestions)
2. **Show/Hide event details**
3. **Specify number of events**
4. **PWA offline support** (AppShell cached; last events cached in localStorage)
5. **Installable** (manifest + service worker)
6. **Data visualization** with Recharts:
   - Pie: event genres distribution
   - Scatter: events per city (responsive, labeled)

## Tech Stack
- **Frontend:** React (Vite), JSX, CSS
- **PWA:** Web App Manifest, Service Worker (Workbox / vite-plugin-pwa)
- **Charts:** Recharts
- **Testing:** Jest, React Testing Library
- **Deploy:** Vercel

## PWA Notes
- Manifest icons in `/public`
- Service worker registered in production
- Offline UX: warns when offline; loads last events from `localStorage` if needed

## Scripts
- `npm run dev` — local dev
- `npm run build` — production build
- `npm run preview` — preview build locally

## Screenshots
<!-- Add images or links here -->
<!-- Example:
![Home](./docs/screens/home.png)
![Charts](./docs/screens/charts.png)
-->

## Domain Verification
- Origin verified at: **https://dpatil1719.github.io**
- App property verified at: **https://meet-app-lilac.vercel.app/**

## License
MIT
