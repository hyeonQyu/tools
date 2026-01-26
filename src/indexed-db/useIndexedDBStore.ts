import { INDEXED_DB_CONFIG } from '@/indexed-db/db.config';
import { useIndexedDB } from '@/indexed-db/IndexedDBContext';
import { ExtractStoreMap } from '@/indexed-db/types';
import { createIndexedDBStore, StoreAPI } from '@/indexed-db/utils';
import { useMemo } from 'react';

type AppStoreMap = ExtractStoreMap<typeof INDEXED_DB_CONFIG>;
type AppStoreName = keyof AppStoreMap;

export const useIndexedDBStore = <N extends AppStoreName>(storeName: N): StoreAPI<AppStoreMap[N]['data'], AppStoreMap[N]['key']> | null => {
  const { db, isReady } = useIndexedDB();

  return useMemo(() => {
    if (!db || !isReady) {
      return null;
    }
    return createIndexedDBStore<AppStoreMap[N]['data'], AppStoreMap[N]['key']>(db, storeName);
  }, [db, isReady, storeName]);
};
