import { BudgetingPresetPayload } from '@/features/budgeting/types';
import { DocumentEntity } from '@/firebase';

export type BudgetingPresetEntity = { userId: string } & DocumentEntity<BudgetingPresetPayload>;

export interface BudgetingPresetRepository {
  create: (payload: BudgetingPresetPayload) => Promise<string>;
  findAll: () => Promise<BudgetingPresetEntity[]>;
  findByName: (name: string) => Promise<BudgetingPresetEntity | null>;
  rename: (id: string, name: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
}
