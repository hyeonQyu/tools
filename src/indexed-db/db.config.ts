import { allocationTypeSchema, budgetingUnitSchema, budgetItemSchema } from '@/features/budgeting/types';
import { StoreConfig } from '@/indexed-db/types';
import { z } from 'zod';

export const createIndexedDBConfig = <const T extends readonly StoreConfig[]>(config: { name: string; version: number; stores: T }) =>
  config;

const currentBudgetingSchema = z.object({
  id: z.literal('current-budgeting'),
  form: z.object({
    totalAmount: z.number(),
    allocationType: allocationTypeSchema,
    items: z.array(budgetItemSchema),
  }),
  config: z.object({
    inputUnit: budgetingUnitSchema,
    controlUnit: budgetingUnitSchema,
  }),
  savedAt: z.number(),
});

export const INDEXED_DB_CONFIG = createIndexedDBConfig({
  name: 'tools',
  version: 3,
  stores: [
    {
      name: 'current-budgeting',
      schema: currentBudgetingSchema,
      keyPath: 'id',
      autoIncrement: false,
    },
  ] as const,
});
