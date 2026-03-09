import { getGoalsFindByYearQueryOptions } from '@/features/goals-tracking/queries';
import { TIME_UNIT } from '@/lib';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useYearlyGoals = (year: number) => {
  const {
    data: { goals },
  } = useSuspenseQuery({
    ...getGoalsFindByYearQueryOptions(year),
    staleTime: TIME_UNIT.unitOfMs.asDay,
  });

  return goals;
};
