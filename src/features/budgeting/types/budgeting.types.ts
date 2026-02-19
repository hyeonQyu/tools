import { z } from 'zod';

export const budgetingUnitSchema = z.union([z.literal(1), z.literal(10000), z.literal(100000)]);

export const allocationTypeSchema = z.enum(['percentage', 'amount']);

export const budgetItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number(),
  isAmountFixed: z.boolean(),
});

export type BudgetingUnit = z.infer<typeof budgetingUnitSchema>;
export type AllocationType = z.infer<typeof allocationTypeSchema>;
export type BudgetingItem = z.infer<typeof budgetItemSchema>;
