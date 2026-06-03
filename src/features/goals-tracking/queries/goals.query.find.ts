import { goalsTrackingService } from '@/features/goals-tracking/data';
import { firebase } from '@/firebase';
import { toKstDateKey } from '@/lib';

export const getGoalsFindAllQueryOptions = () => {
  return {
    queryKey: ['goals', 'find', firebase.auth.currentUser?.uid] as const,
  };
};

export const getGoalsFindByDateQueryOptions = (date: Date) => {
  return {
    queryKey: [...getGoalsFindAllQueryOptions().queryKey, toKstDateKey(date)] as const,
    queryFn: () => goalsTrackingService.getDailyRecords(date),
  };
};

export const getGoalsFindByYearQueryOptions = (year: number) => {
  return {
    queryKey: [...getGoalsFindAllQueryOptions().queryKey, year] as const,
    queryFn: () => goalsTrackingService.getYearlyRecords(year),
  };
};
