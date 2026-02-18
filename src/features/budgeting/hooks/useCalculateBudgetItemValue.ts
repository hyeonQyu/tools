import { useBudgetingStore } from '@/features/budgeting/stores';
import { BudgetingItem } from '@/features/budgeting/types';
import { useTotalAllocatableAmount } from './useTotalAllocatableAmount';

export const useCalculateBudgetItemValue = () => {
  const allocationType = useBudgetingStore((store) => store.allocationType);
  const totalAllocatableAmount = useTotalAllocatableAmount();

  return (item: BudgetingItem) => {
    if (item.isAmountFixed || allocationType === 'amount') {
      const amount = item.value;
      const percentage = totalAllocatableAmount > 0 ? (amount / totalAllocatableAmount) * 100 : 0;
      return { amount, percentage };
    }

    const percentage = item.value;
    const amount = (percentage / 100) * totalAllocatableAmount;
    return { amount, percentage };
  };
};
