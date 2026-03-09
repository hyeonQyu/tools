import { getGoalsFindByDateQueryOptions } from '@/features/goals-tracking/queries';
import { TIME_UNIT } from '@/lib';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useDeferredValue } from 'react';

export const useDailyGoals = (date: Date) => {
  const deferredDate = useDeferredValue(date);

  const {
    data: { goals },
  } = useSuspenseQuery({
    ...getGoalsFindByDateQueryOptions(deferredDate),
    staleTime: TIME_UNIT.unitOfMs.asDay,
  });

  return goals;
};
