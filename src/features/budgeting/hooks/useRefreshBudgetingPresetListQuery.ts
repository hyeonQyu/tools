import { getBudgetingPresetListQueryOptions } from '@/features/budgeting/queries';
import { useQueryClient } from '@tanstack/react-query';

export const useRefreshBudgetingPresetListQuery = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries(getBudgetingPresetListQueryOptions());
};
