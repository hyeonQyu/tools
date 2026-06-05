import { goalsTrackingService } from '@/features/goals-tracking/data';

export const getGoalsReorderMutationOptions = () => {
  return {
    mutationKey: ['goals', 'reorder'] as const,
    mutationFn: (goalIds: string[]) => goalsTrackingService.reorder(goalIds),
  };
};
