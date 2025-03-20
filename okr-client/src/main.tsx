import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import OkrProvider from './context/okr.provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OkrProvider>
      <App />
    </OkrProvider>
  </StrictMode>
);
