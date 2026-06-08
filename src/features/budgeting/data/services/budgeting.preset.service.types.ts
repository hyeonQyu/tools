import { BudgetingPresetPayload } from '@/features/budgeting/types';
import { BudgetingPresetEntity, BudgetingPresetRepository } from '../repositories';

export interface BudgetingPresetService {
  save: (payload: BudgetingPresetPayload) => Promise<void>;
  findAll: () => Promise<BudgetingPresetEntity[]>;
  rename: (id: string, newName: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export interface BudgetingPresetServiceDependencies {
  budgetingPresetRepository: BudgetingPresetRepository;
}
