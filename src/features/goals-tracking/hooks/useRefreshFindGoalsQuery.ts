import { getGoalsFindAllQueryOptions } from '@/features/goals-tracking/queries';
import { useQueryClient } from '@tanstack/react-query';

export const useRefreshFindGoalsQuery = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries(getGoalsFindAllQueryOptions());
};
