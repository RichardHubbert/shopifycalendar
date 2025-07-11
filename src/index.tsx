import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@shopify/polaris/build/esm/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 