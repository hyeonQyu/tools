import { useCurrentBudgetingQueryOptions } from '@/features/budgeting/hooks/useCurrentBudgetingQueryOptions';
import { useQuery } from '@tanstack/react-query';

export const useQueryCurrentBudgeting = () => {
  const queryOptions = useCurrentBudgetingQueryOptions();
  return useQuery(queryOptions);
};
