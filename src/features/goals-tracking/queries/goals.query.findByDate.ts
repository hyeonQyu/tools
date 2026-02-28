import { goalsTrackingService } from '../data';

export const getGoalsFindByDateQueryOptions = (date: Date) => {
  return {
    queryKey: ['goals', 'findByDate', date.toDateString()],
    queryFn: () => goalsTrackingService.getDailyRecords(date),
  };
};
