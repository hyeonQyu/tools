import { BudgetingEntity, BudgetingPayload, BudgetingRepository } from '@/features/budgeting/data/repositories';

export interface BudgetingService {
  save: (payload: BudgetingPayload) => Promise<void>;
  load: () => Promise<BudgetingEntity | null>;
}

export interface BudgetingServiceDependencies {
  budgetingRepository: BudgetingRepository;
}
