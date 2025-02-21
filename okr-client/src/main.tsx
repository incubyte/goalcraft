import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import OkrProvider from './context/OkrProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OkrProvider>
      <App />
    </OkrProvider>
  </StrictMode>
);
