import { z } from 'zod';
import { allocationTypeSchema, budgetItemSchema } from './budgeting.types';

export const budgetingPresetFormSchema = z.object({
  totalAmount: z.number(),
  allocationType: allocationTypeSchema,
  items: z.array(budgetItemSchema),
});

export const budgetingPresetPayloadSchema = z.object({
  name: z.string(),
  form: budgetingPresetFormSchema,
});

export type BudgetingPresetForm = z.infer<typeof budgetingPresetFormSchema>;
export type BudgetingPresetPayload = z.infer<typeof budgetingPresetPayloadSchema>;
