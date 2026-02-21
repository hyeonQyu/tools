import { RefObject, useEffect } from 'react';

export const useAutoTimeoutFocus = (ref: RefObject<HTMLInputElement>) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, [ref]);
};
