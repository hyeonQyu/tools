export type StoreMode = 'readonly' | 'readwrite';

export interface PaginationOptions {
  offset?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
}

export interface IndexQueryOptions {
  direction?: IDBCursorDirection;
  limit?: number;
}

export interface RangeQueryOptions {
  lower?: unknown;
  upper?: unknown;
  lowerOpen?: boolean;
  upperOpen?: boolean;
}
