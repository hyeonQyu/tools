import { DialogProvider } from '@/dialog';
import { FirebaseAuthProvider } from '@/firebase';
import { IndexedDBProvider } from '@/indexed-db';
import ReactQueryClientProvider from '@/react-query/ReactQueryClientProvider';
import { AppRoutesProvider } from '@/routes';
import { ThemeProvider } from '@/styles';
import { SnackbarProvider } from 'notistack';
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
            <FirebaseAuthProvider>
              <IndexedDBProvider>
                <DialogProvider>
                  <SnackbarProvider>
                    <App />
                  </SnackbarProvider>
                </DialogProvider>
              </IndexedDBProvider>
            </FirebaseAuthProvider>
          </ThemeProvider>
        </ReactQueryClientProvider>
      </BrowserRouter>
    </AppRoutesProvider>
  </StrictMode>,
);
