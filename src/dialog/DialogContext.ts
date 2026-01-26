import { createContext } from 'react';
import { DialogContextValue } from './dialog.types';

export const DialogContext = createContext<DialogContextValue | null>(null);
