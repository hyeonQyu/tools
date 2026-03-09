import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import { GoalInformationDialog, GoalResult } from '@/features/goals-tracking/components/GoalInformationDialog';
import { goalsTrackingService } from '@/features/goals-tracking/data';
import { useRefreshFindGoalsQuery } from '@/features/goals-tracking/hooks';
import { getGoalsFindByYearQueryOptions } from '@/features/goals-tracking/queries';
import { useGoalsTrackingYearStore } from '@/features/goals-tracking/stores';
import { enqueueClosableSnackbar } from '@/styles';
import { useQueryClient } from '@tanstack/react-query';

export const useOpenGoalUpdateButton = () => {
  const dialog = useDialog();
  const queryClient = useQueryClient();

  const year = useGoalsTrackingYearStore((store) => store.year);
  const goalsByYearQueryOptions = getGoalsFindByYearQueryOptions(year);

  const refreshFindGoalsQuery = useRefreshFindGoalsQuery();

  const findGoal = async (goalId: string) => {
    const data = await queryClient.getQueryData<ReturnType<typeof goalsByYearQueryOptions.queryFn>>(goalsByYearQueryOptions.queryKey);
    if (!data) return null;
    return data.goals.find(({ goal }) => goal.id === goalId)?.goal;
  };

  return async (goalId: string) => {
    const goal = await findGoal(goalId);

    if (!goal) {
      return enqueueClosableSnackbar({
        message: '목표를 찾을 수 없습니다.',
        variant: 'error',
      });
    }

    return dialog.open<GoalResult>({
      title: '목표 수정',
      content: (close) => (
        <GoalInformationDialog
          defaultValues={goal}
          close={close}
          confirmConfig={{
            label: '수정',
            onConfirm: async (goal) => {
              await goalsTrackingService.update(goalId, goal);
              await refreshFindGoalsQuery();

              enqueueClosableSnackbar({
                message: '목표가 수정되었습니다.',
                variant: 'success',
              });

              close(goal);
            },
          }}
        />
      ),
      fullScreen: true,
      slots: {
        transition: SlideUpTransition,
      },
    });
  };
};
