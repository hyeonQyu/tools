import { goalsTrackingService } from '@/features/goals-tracking/data';

export const getGoalsFindAllQueryOptions = () => {
  return {
    queryKey: ['goals', 'find'] as const,
  };
};

export const getGoalsFindByDateQueryOptions = (date: Date) => {
  return {
    queryKey: [...getGoalsFindAllQueryOptions().queryKey, date.toDateString()] as const,
    queryFn: () => goalsTrackingService.getDailyRecords(date),
  };
};
