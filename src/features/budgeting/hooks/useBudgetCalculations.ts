import { useCalculateBudgetItemValue } from '@/features/budgeting/hooks/useCalculateBudgetItemValue';
import { useBudgetingStore } from '@/features/budgeting/stores';
import { useMemo } from 'react';
import { useFixedSum } from './useFixedSum';
import { useTotalAllocatableAmount } from './useTotalAllocatableAmount';

interface ItemCalculation {
  itemId: string;
  amount: number;
  percentage: number;
}

interface BudgetCalculations {
  totalAllocatableAmount: number;
  restAllocatableAmount: number;
  itemCalculations: Map<string, ItemCalculation>;
  isOverBudget: boolean;
  totalAllocatedAmount: number;
}

export const useBudgetCalculations = (): BudgetCalculations => {
  const totalAmount = useBudgetingStore((store) => store.totalAmount);
  const items = useBudgetingStore((store) => store.items);

  const fixedSum = useFixedSum();
  const totalAllocatableAmount = useTotalAllocatableAmount();
  const calculateBudgetItemValue = useCalculateBudgetItemValue();

  return useMemo(() => {
    const itemCalculations = items.reduce((acc, item) => {
      const { amount, percentage } = calculateBudgetItemValue(item);

      acc.set(item.id, {
        itemId: item.id,
        amount,
        percentage,
      });

      return acc;
    }, new Map<string, ItemCalculation>());

    const nonFixedSum = items
      .filter((item) => !item.isAmountFixed)
      .reduce((sum, item) => {
        const calculation = itemCalculations.get(item.id);
        return sum + (calculation?.amount || 0);
      }, 0);

    const restAllocatableAmount = totalAllocatableAmount - nonFixedSum;

    const totalAllocatedAmount = fixedSum + nonFixedSum;

    const isOverBudget = totalAllocatedAmount > totalAmount;

    return {
      totalAllocatableAmount,
      restAllocatableAmount,
      itemCalculations,
      isOverBudget,
      totalAllocatedAmount,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalAmount, items, fixedSum, totalAllocatableAmount]);
};
