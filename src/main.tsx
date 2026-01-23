import { IndexedDBProvider } from '@/indexed-db';
import { ThemeProvider } from '@/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <IndexedDBProvider>
          <App />
        </IndexedDBProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
