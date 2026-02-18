import { BudgetingPayload, BudgetingRepository } from '@/features/budgeting/data/repositories';

export interface BudgetingService {
  save: (payload: BudgetingPayload) => Promise<void>;
}

export interface BudgetingServiceDependencies {
  budgetingRepository: BudgetingRepository;
}
