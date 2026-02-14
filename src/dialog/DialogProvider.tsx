import { generateRandomKey, r } from '@/lib';
import { BOTTOM_NAVIGATION_HEIGHT } from '@/routes';
import { Button, DialogActions, DialogContent, DialogTitle, Dialog as MUIDialog } from '@mui/material';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { DialogContext } from './DialogContext';
import { DialogContextValue, DialogInstance, DialogOptions } from './dialog.types';

interface DialogProviderProps {
  children: ReactNode;
}

interface DialogInstanceWithState<T = unknown> extends DialogInstance<T> {
  isOpen: boolean;
}

export function DialogProvider({ children }: DialogProviderProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dialogs, setDialogs] = useState<DialogInstanceWithState<any>[]>([]);

  const open = useCallback(function open<T = unknown>(options: DialogOptions<T>): Promise<T | null> {
    return new Promise((resolve) => {
      const id = generateRandomKey('dialog');
      const instance: DialogInstanceWithState<T> = { id, options, resolve, isOpen: true };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setDialogs((prev) => [...prev, instance as any]);
    });
  }, []);

  const closeDialog = useCallback((id: string, result?: unknown) => {
    setDialogs((prev) => {
      const dialog = prev.find((d) => d.id === id);
      if (dialog) {
        dialog.resolve(result ?? null);
        return prev.map((d) => (d.id === id ? { ...d, isOpen: false } : d));
      }
      return prev;
    });
  }, []);

  const removeDialog = useCallback((id: string) => {
    setDialogs((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const alert = useCallback(
    async (options: Omit<DialogOptions<void>, 'content'> & { content: ReactNode }): Promise<void> => {
      return open({
        ...options,
        content: (close) => (
          <>
            <DialogContent>{options.content}</DialogContent>
            <DialogActions>
              <Button onClick={() => close()} variant="contained">
                확인
              </Button>
            </DialogActions>
          </>
        ),
      }).then(() => undefined);
    },
    [open],
  );

  const confirm = useCallback(
    async (options: Omit<DialogOptions<boolean>, 'content'> & { content: ReactNode }): Promise<boolean> => {
      return open<boolean>({
        ...options,
        content: (close) => (
          <>
            <DialogContent>{options.content}</DialogContent>
            <DialogActions>
              <Button onClick={() => close(false)}>취소</Button>
              <Button onClick={() => close(true)} variant="contained">
                확인
              </Button>
            </DialogActions>
          </>
        ),
      }).then((result) => result ?? false);
    },
    [open],
  );

  const contextValue: DialogContextValue = useMemo(
    () => ({
      open,
      alert,
      confirm,
    }),
    [open, alert, confirm],
  );

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
      {dialogs.map(({ id, options, isOpen }) => {
        const handleClose = (result?: unknown) => {
          closeDialog(id, result);
        };

        const renderedContent = r(options.content)(handleClose);

        return (
          <MUIDialog
            key={id}
            open={isOpen}
            fullScreen={options.fullScreen}
            maxWidth={options.maxWidth}
            fullWidth={options.fullWidth}
            scroll={options.scroll}
            slots={options.slots}
            slotProps={{
              transition: {
                onExited: () => removeDialog(id),
              },
            }}
            transitionDuration={options.transitionDuration}
            keepMounted={options.keepMounted}
            onClose={(_, reason) => {
              if (reason === 'backdropClick' && options.disableBackdropClick) return;
              if (reason === 'escapeKeyDown' && options.disableEscapeKeyDown) return;
              handleClose(null);
            }}
            sx={
              options.fullScreen
                ? {
                    '& .MuiDialog-container': {
                      alignItems: 'flex-start',
                    },
                    '& .MuiDialog-paper': {
                      maxHeight: `calc(100dvh - ${BOTTOM_NAVIGATION_HEIGHT}px)`,
                    },
                  }
                : undefined
            }
          >
            {options.title && <DialogTitle>{options.title}</DialogTitle>}
            {renderedContent}
          </MUIDialog>
        );
      })}
    </DialogContext.Provider>
  );
}
