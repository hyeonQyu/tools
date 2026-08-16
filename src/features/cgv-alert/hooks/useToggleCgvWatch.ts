import { cgvAlertService } from '@/features/cgv-alert/data';
import { CgvWatchEntity } from '@/features/cgv-alert/types';
import { enqueueClosableSnackbar } from '@/styles';
import { useRefreshCgvWatchQuery } from './useRefreshCgvAlertQuery';

export const useToggleCgvWatch = () => {
  const refresh = useRefreshCgvWatchQuery();

  return async (watch: CgvWatchEntity) => {
    try {
      await cgvAlertService.setWatchEnabled(watch.id, !watch.enabled);
      await refresh();
    } catch (error) {
      console.error(error);
      enqueueClosableSnackbar({ message: '감시 상태 변경에 실패했습니다.', variant: 'error' });
    }
  };
};
