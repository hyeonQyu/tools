import { BudgetingUnit } from '@/features/budgeting/types';

export const getUnitLabel = (unit: BudgetingUnit): string => {
  switch (unit) {
    case 1:
      return '원';
    case 10000:
      return '만';
    case 100000:
      return '10만';
    default:
      return '원';
  }
};
