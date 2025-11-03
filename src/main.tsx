import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeModules } from './modules';

// Initialize all modules before rendering the app
initializeModules().then(() => {
  console.log('Modules initialized successfully');

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}).catch((error) => {
  console.error('Failed to initialize modules:', error);

  // Still render the app, but show error state
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
