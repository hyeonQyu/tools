import { AllocationType, BudgetingItem, BudgetingUnit } from '@/features/budgeting/types/budgeting.types';
import { DocumentEntity } from '@/firebase';

export type BudgetingPayload = {
  form: {
    totalAmount: number;
    allocationType: AllocationType;
    items: BudgetingItem[];
  };
  config: {
    inputUnit: BudgetingUnit;
    controlUnit: BudgetingUnit;
  };
};

export type BudgetingEntity = DocumentEntity<BudgetingPayload>;

export interface BudgetingRepository {
  create: (payload: BudgetingPayload) => Promise<void>;
  update: (payload: BudgetingPayload) => Promise<void>;
  exists: () => Promise<boolean>;
}
