import { IDBPDatabase } from 'idb';
import { createContext, useContext } from 'react';
import { DBConfig } from './types';

export const IndexedDBContext = createContext<
  | {
      db: IDBPDatabase | null;
      config: DBConfig;
      isReady: boolean;
      error: Error | null;
    }
  | undefined
>(undefined);

export const useIndexedDB = () => {
  const context = useContext(IndexedDBContext);
  if (!context) {
    throw new Error('IndexedDBContext를 사용하기 전에 IndexedDBProvider로 감싸주세요.');
  }
  return context;
};
