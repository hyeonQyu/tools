import { useBudgetingStore } from '../stores';

export const useFixedSum = (): number => {
  return useBudgetingStore((store) => store.items.filter((item) => item.isAmountFixed).reduce((sum, item) => sum + item.value, 0));
};
