import { IndexQueryOptions, PaginatedResult, PaginationOptions } from '@/indexed-db/types';
import { handleIndexedDBError } from '@/indexed-db/utils/error.utils';
import { IDBPDatabase } from 'idb';
import z from 'zod';

export interface StoreAPI<T, K extends IDBValidKey = IDBValidKey> {
  add: (data: T) => Promise<K>;
  get: (id: K) => Promise<T | undefined>;
  getAll: () => Promise<T[]>;
  getAllKeys: () => Promise<K[]>;
  update: (id: K, data: T) => Promise<K>;
  delete: (id: K) => Promise<void>;
  clear: () => Promise<void>;
  count: () => Promise<number>;
  exists: (id: K) => Promise<boolean>;

  getByIndex: (indexName: string, value: IDBValidKey) => Promise<T | undefined>;
  getAllByIndex: (indexName: string, value?: IDBValidKey, options?: IndexQueryOptions) => Promise<T[]>;

  bulkAdd: (items: T[]) => Promise<K[]>;
  bulkUpdate: (items: Array<{ id: K; data: T }>) => Promise<K[]>;
  bulkDelete: (ids: K[]) => Promise<void>;

  getPaginated: (options?: PaginationOptions) => Promise<PaginatedResult<T>>;
  getPaginatedByIndex: (indexName: string, value?: IDBValidKey, options?: PaginationOptions) => Promise<PaginatedResult<T>>;

  forEach: (callback: (value: T, key: K) => void | Promise<void>) => Promise<void>;
  find: (predicate: (value: T) => boolean) => Promise<T | undefined>;
  filter: (predicate: (value: T) => boolean) => Promise<T[]>;
  getRange: (lower: IDBValidKey, upper: IDBValidKey, lowerOpen?: boolean, upperOpen?: boolean) => Promise<T[]>;
}

export const createIndexedDBStore = <T, K extends IDBValidKey = IDBValidKey>(
  db: IDBPDatabase,
  storeName: string,
  schema?: z.ZodType<T>,
): StoreAPI<T, K> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doTransaction = <T extends (...args: any[]) => Promise<any>>(operation: string, action: T) => {
    return async (...args: Parameters<T>) => {
      try {
        return await action(...args);
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(`Validation failed: ${error.message}`);
        }
        return handleIndexedDBError(error, `${storeName}.${operation}`);
      }
    };
  };

  const validate = (data: T): T => {
    return schema ? schema.parse(data) : data;
  };

  const createPaginatedResult = (allData: T[], total: number, offset: number, limit: number): PaginatedResult<T> => {
    const data = allData.slice(offset, offset + limit);
    const hasMore = offset + limit < total;
    return { data, total, offset, limit, hasMore };
  };

  const add = doTransaction('add', async (data: T): Promise<K> => {
    const validated = validate(data);
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const key = await store.add(validated);
    return key as K;
  });

  const get = doTransaction('get', async (id: K): Promise<T | undefined> => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const result = await store.get(id);
    return result as T | undefined;
  });

  const getAll = doTransaction('getAll', async (): Promise<T[]> => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const results = await store.getAll();
    return results as T[];
  });

  const getAllKeys = doTransaction('getAllKeys', async (): Promise<K[]> => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const keys = await store.getAllKeys();
    return keys as K[];
  });

  const update = doTransaction('update', async (id: K, data: T): Promise<K> => {
    const validated = validate(data);
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    // For in-line keys (autoIncrement), don't provide the key parameter
    // The id should already be in the data object
    const dataWithId = { ...validated, [store.keyPath as string]: id } as T;
    const key = await store.put(dataWithId);
    return key as K;
  });

  const deleteItem = async (id: K): Promise<void> => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.delete(id);
  };

  const clear = doTransaction('clear', async (): Promise<void> => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.clear();
  });

  const count = doTransaction('count', (): Promise<number> => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    return store.count();
  });

  const exists = doTransaction('exists', async (id: K): Promise<boolean> => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const data = await store.get(id);
    return data !== undefined;
  });

  const getByIndex = doTransaction('getByIndex', async (indexName: string, value: IDBValidKey): Promise<T | undefined> => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    const result = await index.get(value);
    return result as T | undefined;
  });

  const getAllByIndex = doTransaction(
    'getAllByIndex',
    async (indexName: string, value?: IDBValidKey, options?: IndexQueryOptions): Promise<T[]> => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const count = options?.limit;
      const results = await index.getAll(value, count);
      return results as T[];
    },
  );

  const bulkAdd = doTransaction('bulkAdd', async (items: T[]): Promise<K[]> => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const keys: K[] = [];
    for (const item of items) {
      const validated = validate(item);
      const key = await store.add(validated);
      keys.push(key as K);
    }
    await tx.done;
    return keys;
  });

  const bulkUpdate = doTransaction('bulkUpdate', async (items: Array<{ id: K; data: T }>): Promise<K[]> => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const keys: K[] = [];
    for (const { id, data } of items) {
      const validated = validate(data);
      // For in-line keys (autoIncrement), don't provide the key parameter
      const dataWithId = { ...validated, [store.keyPath as string]: id } as T;
      const key = await store.put(dataWithId);
      keys.push(key as K);
    }
    return keys;
  });

  const bulkDelete = doTransaction('bulkDelete', async (ids: K[]): Promise<void> => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);

    for (const id of ids) {
      await store.delete(id);
    }
  });

  const getPaginated = doTransaction('getPaginated', async (options: PaginationOptions = {}): Promise<PaginatedResult<T>> => {
    const { offset = 0, limit = 10 } = options;
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);

    const total = await store.count();
    const allData = await store.getAll();

    return createPaginatedResult(allData as T[], total, offset, limit);
  });

  const getPaginatedByIndex = doTransaction(
    'getPaginatedByIndex',
    async (indexName: string, value?: IDBValidKey, options: PaginationOptions = {}): Promise<PaginatedResult<T>> => {
      const { offset = 0, limit = 10 } = options;
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const total = await index.count(value);
      const allData = await index.getAll(value);
      return createPaginatedResult(allData as T[], total, offset, limit);
    },
  );

  const forEach = doTransaction('forEach', async (callback: (value: T, key: K) => void | Promise<void>): Promise<void> => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    let cursor = await store.openCursor();

    while (cursor) {
      await callback(cursor.value as T, cursor.key as K);
      cursor = await cursor.continue();
    }
  });

  const find = doTransaction('find', async (predicate: (value: T) => boolean): Promise<T | undefined> => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    let cursor = await store.openCursor();

    while (cursor) {
      const value = cursor.value as T;
      if (predicate(value)) {
        return value;
      }
      cursor = await cursor.continue();
    }
  });

  const filter = doTransaction('filter', async (predicate: (value: T) => boolean): Promise<T[]> => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const results: T[] = [];
    let cursor = await store.openCursor();

    while (cursor) {
      const value = cursor.value as T;
      if (predicate(value)) {
        results.push(value);
      }
      cursor = await cursor.continue();
    }
    return results;
  });

  const getRange = doTransaction(
    'getRange',
    async (lower: IDBValidKey, upper: IDBValidKey, lowerOpen = false, upperOpen = false): Promise<T[]> => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const range = IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen);
      const results = await store.getAll(range);
      return results as T[];
    },
  );

  return {
    add,
    get,
    getAll,
    getAllKeys,
    update,
    delete: deleteItem,
    clear,
    count,
    exists,
    getByIndex,
    getAllByIndex,
    bulkAdd,
    bulkUpdate,
    bulkDelete,
    getPaginated,
    getPaginatedByIndex,
    forEach,
    find,
    filter,
    getRange,
  };
};
