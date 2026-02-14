import { DialogProvider } from '@/dialog';
import { IndexedDBProvider } from '@/indexed-db';
import ReactQueryClientProvider from '@/react-query/ReactQueryClientProvider';
import { AppRoutesProvider } from '@/routes';
import { ThemeProvider } from '@/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';

registerSW({
  immediate: true,
});

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
