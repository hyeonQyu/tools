import { DialogProvider } from '@/dialog';
import { IndexedDBProvider } from '@/indexed-db';
import { ThemeProvider } from '@/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <IndexedDBProvider>
          <DialogProvider>
            <App />
          </DialogProvider>
        </IndexedDBProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
