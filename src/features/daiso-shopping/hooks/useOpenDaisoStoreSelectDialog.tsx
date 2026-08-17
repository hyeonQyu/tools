import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import { DaisoStoreSelectDialog } from '@/features/daiso-shopping/components/DaisoStoreSelectDialog';

export const useOpenDaisoStoreSelectDialog = () => {
  const dialog = useDialog();

  return async () => {
    await dialog.open({
      title: '매장 선택',
      content: (close) => <DaisoStoreSelectDialog close={close} />,
      fullScreen: true,
      slots: { transition: SlideUpTransition },
    });
  };
};
