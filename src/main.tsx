import { DialogProvider } from '@/dialog';
import { IndexedDBProvider } from '@/indexed-db';
import ReactQueryClientProvider from '@/react-query/ReactQueryClientProvider';
import { ThemeProvider } from '@/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ReactQueryClientProvider>
        <ThemeProvider>
          <IndexedDBProvider>
            <DialogProvider>
              <App />
            </DialogProvider>
          </IndexedDBProvider>
        </ThemeProvider>
      </ReactQueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
