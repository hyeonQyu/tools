import { StoreConfig } from '@/indexed-db/types';

export const createIndexedDBConfig = <const T extends readonly StoreConfig[]>(config: { name: string; version: number; stores: T }) =>
  config;

export const INDEXED_DB_CONFIG = createIndexedDBConfig({
  name: 'tools',
  version: 1,
  stores: [] as const,
});
