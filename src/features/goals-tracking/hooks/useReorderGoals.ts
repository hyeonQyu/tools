import { getGoalsReorderMutationOptions } from '@/features/goals-tracking/queries';
import { useMutation } from '@tanstack/react-query';
import { useRefreshFindGoalsQuery } from './useRefreshFindGoalsQuery';

export const useReorderGoals = () => {
  const refreshFindGoalsQuery = useRefreshFindGoalsQuery();

  const { mutate } = useMutation({
    ...getGoalsReorderMutationOptions(),
    onSuccess: refreshFindGoalsQuery,
  });

  return mutate;
};
