import { handleIndexedDBError } from './error.utils';

export const deleteIndexedDB = async (dbName: string): Promise<void> => {
  try {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(dbName);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => {
        console.warn(`Delete blocked for ${dbName}. Please close other tabs.`);
      };
    });
  } catch (error) {
    return handleIndexedDBError(error, 'deleteIndexedDB');
  }
};

export const listIndexedDBs = async (): Promise<string[]> => {
  try {
    if ('databases' in indexedDB) {
      const databases = await indexedDB.databases();
      return databases.map((db) => db.name || '').filter(Boolean);
    }
    return [];
  } catch (error) {
    console.error('Failed to list databases:', error);
    return [];
  }
};
