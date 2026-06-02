import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import { ExpirationDateItemDialog } from '@/features/expiration-dates/components/ExpirationDateItemDialog';
import { expirationDateService } from '@/features/expiration-dates/data';
import { useExpirationDateStore } from '@/features/expiration-dates/stores';
import { ExpirationDateItemEntity } from '@/features/expiration-dates/types';
import { enqueueClosableSnackbar } from '@/styles';
import { useRefreshExpirationDateQuery } from './useRefreshExpirationDateQuery';

export const useOpenExpirationDateItemDialog = () => {
  const dialog = useDialog();
  const refresh = useRefreshExpirationDateQuery();
  const settings = useExpirationDateStore((s) => s.settings);

  const openAdd = async (initialDate?: Date) => {
    await dialog.open({
      title: '물품 추가',
      content: (close) => (
        <ExpirationDateItemDialog
          close={close}
          locationSuggestions={settings.locations}
          tagSuggestions={settings.tags}
          confirmLabel="추가"
          initialValues={initialDate ? ({ expirationDate: initialDate } as ExpirationDateItemEntity) : undefined}
          onConfirm={async (payload) => {
            await expirationDateService.create(payload);
            await refresh();
            enqueueClosableSnackbar({ message: '물품이 추가되었습니다.', variant: 'success' });
          }}
        />
      ),
      fullScreen: true,
      slots: { transition: SlideUpTransition },
    });
  };

  const openEdit = async (item: ExpirationDateItemEntity) => {
    await dialog.open({
      title: '물품 편집',
      content: (close) => (
        <ExpirationDateItemDialog
          close={close}
          initialValues={item}
          locationSuggestions={settings.locations}
          tagSuggestions={settings.tags}
          confirmLabel="저장"
          onConfirm={async (payload) => {
            await expirationDateService.update(item.id, payload);
            await refresh();
            enqueueClosableSnackbar({ message: '물품이 수정되었습니다.', variant: 'success' });
          }}
          onDelete={async () => {
            await expirationDateService.delete(item.id);
            await refresh();
            enqueueClosableSnackbar({ message: '물품이 삭제되었습니다.', variant: 'success' });
          }}
        />
      ),
      fullScreen: true,
      slots: { transition: SlideUpTransition },
    });
  };

  return { openAdd, openEdit };
};
