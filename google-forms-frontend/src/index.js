import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: report web vitals for performance monitoring
// Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); // Or: reportWebVitals(console.log);
