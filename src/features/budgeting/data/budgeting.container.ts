import { budgetingRepository } from '@/features/budgeting/data/repositories';
import { createBudgetingService } from '@/features/budgeting/data/services';

export const budgetingService = createBudgetingService({ budgetingRepository });
