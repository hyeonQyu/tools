import { budgetingService } from '@/features/budgeting/data';

export const getBudgetingLoadQueryOptions = () => {
  return {
    queryKey: ['budgeting', 'load'],
    queryFn: () => budgetingService.load(),
  };
};
