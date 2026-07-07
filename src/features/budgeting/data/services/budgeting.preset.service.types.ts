import { BudgetingPresetForm, BudgetingPresetPayload } from '@/features/budgeting/types';
import { BudgetingPresetEntity, BudgetingPresetRepository } from '../repositories';

export interface BudgetingPresetService {
  save: (payload: BudgetingPresetPayload) => Promise<string>;
  findAll: () => Promise<BudgetingPresetEntity[]>;
  update: (id: string, form: BudgetingPresetForm) => Promise<void>;
  rename: (id: string, newName: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export interface BudgetingPresetServiceDependencies {
  budgetingPresetRepository: BudgetingPresetRepository;
}
