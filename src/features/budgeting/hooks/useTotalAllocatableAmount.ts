import { useBudgetingStore } from '../stores';
import { useFixedSum } from './useFixedSum';

export const useTotalAllocatableAmount = (): number => {
  const totalAmount = useBudgetingStore((store) => store.totalAmount);
  const fixedSum = useFixedSum();

  return totalAmount - fixedSum;
};
