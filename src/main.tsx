import { DialogProvider } from '@/dialog';
import { IndexedDBProvider } from '@/indexed-db';
import ReactQueryClientProvider from '@/react-query/ReactQueryClientProvider';
import { AppRoutesProvider } from '@/routes';
import { ThemeProvider } from '@/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRoutesProvider>
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
    </AppRoutesProvider>
  </StrictMode>,
);
