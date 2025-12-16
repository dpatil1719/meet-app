import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// --- Atatus (Browser) ---
import * as atatus from 'atatus-spa';
atatus.config('c9f5afcebbc946b0a4a747899f2ff1cf').install();
// Optional: temporarily test the integration, then remove after you see it in Atatus
// atatus.notify(new Error('Test Atatus Setup'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
