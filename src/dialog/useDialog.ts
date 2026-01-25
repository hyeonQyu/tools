import { useContext } from 'react';
import { DialogContext } from './DialogContext';

export const useDialog = () => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('DialogProvider를 사용하기 전에 DialogProvider로 감싸주세요.');
  }

  return context;
};
