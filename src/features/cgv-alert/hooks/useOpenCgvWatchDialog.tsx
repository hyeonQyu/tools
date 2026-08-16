import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import { CgvWatchDialog } from '@/features/cgv-alert/components/CgvWatchDialog';
import { cgvAlertService } from '@/features/cgv-alert/data';
import { CgvWatchEntity } from '@/features/cgv-alert/types';
import { enqueueClosableSnackbar } from '@/styles';
import { useRefreshCgvWatchQuery } from './useRefreshCgvAlertQuery';

export const useOpenCgvWatchDialog = () => {
  const dialog = useDialog();
  const refresh = useRefreshCgvWatchQuery();

  const openAdd = async () => {
    await dialog.open({
      title: '감시 추가',
      content: (close) => (
        <CgvWatchDialog
          close={close}
          confirmLabel="추가"
          onConfirm={async (payload) => {
            await cgvAlertService.createWatch(payload);
            await refresh();
            enqueueClosableSnackbar({ message: '감시 항목이 추가되었습니다.', variant: 'success' });
          }}
        />
      ),
      fullScreen: true,
      slots: { transition: SlideUpTransition },
    });
  };

  const openEdit = async (watch: CgvWatchEntity) => {
    await dialog.open({
      title: '감시 수정',
      content: (close) => (
        <CgvWatchDialog
          close={close}
          initialValues={watch}
          confirmLabel="저장"
          onConfirm={async (payload) => {
            await cgvAlertService.updateWatch(watch.id, payload);
            await refresh();
            enqueueClosableSnackbar({ message: '감시 항목이 수정되었습니다.', variant: 'success' });
          }}
          onDelete={async () => {
            const confirmed = await dialog.confirm({ title: '감시 삭제', content: '이 감시 항목을 삭제할까요?' });
            if (!confirmed) return false;

            await cgvAlertService.deleteWatch(watch.id);
            await refresh();
            enqueueClosableSnackbar({ message: '감시 항목이 삭제되었습니다.', variant: 'success' });
            return true;
          }}
        />
      ),
      fullScreen: true,
      slots: { transition: SlideUpTransition },
    });
  };

  return { openAdd, openEdit };
};
