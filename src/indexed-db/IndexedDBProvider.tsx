import { IDBPDatabase, openDB } from 'idb';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { INDEXED_DB_CONFIG } from './db.config';
import { IndexedDBContext } from './IndexedDBContext';
import { DBConfig, MigrationFunction } from './types';

interface IndexedDBProviderProps {
  children: ReactNode;
  config?: DBConfig;
  migration?: MigrationFunction;
}

function IndexedDBProvider({ children, config = INDEXED_DB_CONFIG, migration }: IndexedDBProviderProps) {
  const [db, setDb] = useState<IDBPDatabase | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        const dbInstance = await openDB(config.name, config.version, {
          upgrade(dbUpgrade, oldVersion, newVersion, transaction) {
            config.stores.forEach((storeConfig) => {
              if (dbUpgrade.objectStoreNames.contains(storeConfig.name)) {
                const existingStore = transaction.objectStore(storeConfig.name);
                const needsRecreation = existingStore.keyPath !== storeConfig.keyPath;

                if (needsRecreation) {
                  dbUpgrade.deleteObjectStore(storeConfig.name);

                  const objectStore = dbUpgrade.createObjectStore(storeConfig.name, {
                    keyPath: storeConfig.keyPath,
                    autoIncrement: storeConfig.autoIncrement,
                  });

                  if (storeConfig.indexes) {
                    storeConfig.indexes.forEach((indexConfig) => {
                      objectStore.createIndex(indexConfig.name, indexConfig.keyPath, indexConfig.options);
                    });
                  }
                } else {
                  const objectStore = transaction.objectStore(storeConfig.name);

                  if (storeConfig.indexes) {
                    storeConfig.indexes.forEach((indexConfig) => {
                      if (!objectStore.indexNames.contains(indexConfig.name)) {
                        objectStore.createIndex(indexConfig.name, indexConfig.keyPath, indexConfig.options);
                      }
                    });
                  }
                }
              } else {
                const objectStore = dbUpgrade.createObjectStore(storeConfig.name, {
                  keyPath: storeConfig.keyPath,
                  autoIncrement: storeConfig.autoIncrement,
                });

                if (storeConfig.indexes) {
                  storeConfig.indexes.forEach((indexConfig) => {
                    objectStore.createIndex(indexConfig.name, indexConfig.keyPath, indexConfig.options);
                  });
                }
              }
            });

            if (migration) {
              migration(dbUpgrade, oldVersion, newVersion, transaction as unknown as IDBTransaction);
            }
          },
          blocked() {
            console.warn(`Database ${config.name} is blocked. Please close other tabs.`);
          },
          blocking() {
            console.warn(`Database ${config.name} is blocking a version change.`);
          },
          terminated() {
            console.error(`Database ${config.name} connection was unexpectedly terminated.`);
            setError(new Error('Database connection terminated'));
          },
        });

        setDb(dbInstance);
        setIsReady(true);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to initialize IndexedDB:', err);
      }
    };

    initDB();

    return () => {
      if (db) {
        db.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, migration]);

  return (
    <IndexedDBContext.Provider value={useMemo(() => ({ db, config, isReady, error }), [db, config, isReady, error])}>
      {children}
    </IndexedDBContext.Provider>
  );
}

export default IndexedDBProvider;
