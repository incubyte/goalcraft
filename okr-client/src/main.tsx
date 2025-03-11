import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import OkrProvider from './context/OkrProvider.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OkrProvider>
      <App />
    </OkrProvider>
  </StrictMode>
);
