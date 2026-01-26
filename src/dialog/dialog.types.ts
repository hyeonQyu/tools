import { Resolvable } from '@/lib/resolvable.types';
import { DialogProps } from '@mui/material';
import { ReactNode } from 'react';

export type DialogOptions<T = unknown> = Pick<
  DialogProps,
  'fullScreen' | 'maxWidth' | 'fullWidth' | 'scroll' | 'transitionDuration' | 'keepMounted' | 'slots'
> & {
  title?: ReactNode;
  content: Resolvable<(close: (result?: T) => void) => ReactNode>;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
};

export interface DialogInstance<T = unknown> {
  id: string;
  options: DialogOptions<T>;
  resolve: (value: T | null) => void;
}

export interface DialogContextValue {
  open: <T = unknown>(options: DialogOptions<T>) => Promise<T | null>;
  alert: (options: Omit<DialogOptions<void>, 'content'> & { content: ReactNode }) => Promise<void>;
  confirm: (options: Omit<DialogOptions<boolean>, 'content'> & { content: ReactNode }) => Promise<boolean>;
}
