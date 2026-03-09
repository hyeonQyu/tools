export type DocumentEntity<T extends Record<string, unknown>> = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
} & T;
