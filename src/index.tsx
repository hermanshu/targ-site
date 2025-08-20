import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css?v=1.0.5';
import './mobile-styles.css?v=1.0.2';
import './mobile-app-styles.css?v=1.0.2';
import './desktop-styles.css?v=1.0.2';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
