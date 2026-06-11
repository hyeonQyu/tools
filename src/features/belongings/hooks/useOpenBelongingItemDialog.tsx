import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import { BelongingItemDialog } from '@/features/belongings/components/BelongingItemDialog';
import { belongingService } from '@/features/belongings/data';
import { useBelongingStore } from '@/features/belongings/stores';
import { BelongingItemEntity } from '@/features/belongings/types';
import { enqueueClosableSnackbar } from '@/styles';
import { useRefreshBelongingsQuery } from './useRefreshBelongingsQuery';

export const useOpenBelongingItemDialog = () => {
  const dialog = useDialog();
  const refresh = useRefreshBelongingsQuery();
  const settings = useBelongingStore((s) => s.settings);

  const openAdd = async () => {
    await dialog.open({
      title: '물건 추가',
      content: (close) => (
        <BelongingItemDialog
          close={close}
          locationSuggestions={settings.locations}
          tagSuggestions={settings.tags}
          confirmLabel="추가"
          onConfirm={async (payload) => {
            await belongingService.create(payload);
            await refresh();
            enqueueClosableSnackbar({ message: '물건이 추가되었습니다.', variant: 'success' });
          }}
        />
      ),
      fullScreen: true,
      slots: { transition: SlideUpTransition },
    });
  };

  const openEdit = async (item: BelongingItemEntity) => {
    await dialog.open({
      title: '물건 편집',
      content: (close) => (
        <BelongingItemDialog
          close={close}
          initialValues={item}
          locationSuggestions={settings.locations}
          tagSuggestions={settings.tags}
          confirmLabel="저장"
          onConfirm={async (payload) => {
            await belongingService.update(item.id, payload);
            await refresh();
            enqueueClosableSnackbar({ message: '물건이 수정되었습니다.', variant: 'success' });
          }}
          onDelete={async () => {
            await belongingService.delete(item.id);
            await refresh();
            enqueueClosableSnackbar({ message: '물건이 삭제되었습니다.', variant: 'success' });
          }}
        />
      ),
      fullScreen: true,
      slots: { transition: SlideUpTransition },
    });
  };

  return { openAdd, openEdit };
};
