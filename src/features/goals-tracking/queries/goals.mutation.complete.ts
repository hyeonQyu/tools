import { goalsTrackingService } from '@/features/goals-tracking/data';
import { GoalDailyRecordPayload } from '@/features/goals-tracking/data/repositories';

export const getGoalsCompleteMutationOptions = () => {
  return {
    mutationKey: ['goals', 'complete'] as const,
    mutationFn: (payload: GoalDailyRecordPayload) => goalsTrackingService.completeGoal(payload),
  };
};

export const getGoalsUncompleteMutationOptions = () => {
  return {
    mutationKey: ['goals', 'uncomplete'] as const,
    mutationFn: (payload: GoalDailyRecordPayload) => goalsTrackingService.uncompleteGoal(payload),
  };
};
