import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css?v=1.0.2';
import './mobile-styles.css?v=1.0.2';
import './mobile-app-styles.css?v=1.0.2';
import './desktop-styles.css?v=1.0.2';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
