export type DocumentEntity<T extends Record<string, unknown>> = {
  id: string;
  createdAt: number;
  updatedAt: number;
} & T;
