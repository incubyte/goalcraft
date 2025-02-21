import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './flags.css';
import App from './App.tsx';
import OkrProvider from './context/OkrProvider.tsx';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OkrProvider>
        <App />
    </OkrProvider>
  </StrictMode>
);
