import { useDialog } from '@/dialog';
import { goalsTrackingService } from '@/features/goals-tracking/data';
import { useRefreshFindGoalsQuery } from '@/features/goals-tracking/hooks/useRefreshFindGoalsQuery';
import { enqueueClosableSnackbar } from '@/styles';

export const useDeleteGoal = () => {
  const dialog = useDialog();
  const refreshFindGoalsQuery = useRefreshFindGoalsQuery();

  return async (goalId: string) => {
    const confirmed = await dialog.confirm({ content: '정말로 삭제하시겠습니까?' });
    if (!confirmed) return;

    try {
      await goalsTrackingService.delete(goalId);
      await refreshFindGoalsQuery();

      enqueueClosableSnackbar({
        message: '목표가 삭제되었습니다.',
        variant: 'success',
      });
    } catch (error) {
      console.error(error);

      enqueueClosableSnackbar({
        message: '목표 삭제에 실패했습니다.',
        variant: 'error',
      });
    }
  };
};
