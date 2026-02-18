import { budgetingService } from '@/features/budgeting/data';
import { useMemo } from 'react';

export const useCurrentBudgetingQueryOptions = () => {
  return useMemo(() => {
    return {
      queryKey: ['current-budgeting'],
      queryFn: () => budgetingService.load(),
    };
  }, []);
};
