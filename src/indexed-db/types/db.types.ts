import { IDBPDatabase } from 'idb';
import { z } from 'zod';

export interface DBSchema {
  [storeName: string]: {
    key: string | number;
    value: unknown;
    indexes?: Record<string, string | number>;
  };
}

export interface StoreConfig {
  name: string;
  schema: z.ZodTypeAny;
  keyPath?: string | string[];
  autoIncrement?: boolean;
  indexes?: IndexConfig[];
}

export interface IndexConfig {
  name: string;
  keyPath: string | string[];
  options?: {
    unique?: boolean;
    multiEntry?: boolean;
  };
}

export interface DBConfig {
  name: string;
  version: number;
  stores: readonly StoreConfig[];
}

export type DBInstance = IDBPDatabase;

export type MigrationFunction = (
  db: IDBPDatabase,
  oldVersion: number,
  newVersion: number | null,
  transaction: IDBTransaction,
) => void | Promise<void>;

export type ExtractStoreMap<T extends { stores: readonly StoreConfig[] }> = {
  [K in T['stores'][number] as K['name']]: {
    data: z.infer<K['schema']>;
    key: IDBValidKey;
  };
};
