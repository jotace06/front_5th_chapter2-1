import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { AppProvider } from './app/app-context';

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
