import { goalsTrackingService } from '@/features/goals-tracking/data';
import { TIME_UNIT, toKstDateKey } from '@/lib';

export const getGoalsFindAllQueryOptions = () => {
  return {
    queryKey: ['goals', 'find'] as const,
  };
};

export const getGoalsFindByDateQueryOptions = (date: Date) => {
  return {
    queryKey: [...getGoalsFindAllQueryOptions().queryKey, toKstDateKey(date)] as const,
    queryFn: () => goalsTrackingService.getDailyRecords(date),
    staleTime: TIME_UNIT.unitOfMs.asDay,
  };
};
