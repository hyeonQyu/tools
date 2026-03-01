import { getGoalsFindByDateQueryOptions } from '@/features/goals-tracking/queries';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useDeferredValue } from 'react';

export const useDailyGoals = (date: Date) => {
  const deferredDate = useDeferredValue(date);

  const {
    data: { goals },
  } = useSuspenseQuery(getGoalsFindByDateQueryOptions(deferredDate));

  return goals;
};
