import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import { DaisoItemDetailDialog } from '@/features/daiso-shopping/components/DaisoItemDetailDialog';

export const useOpenDaisoItemDetailDialog = () => {
  const dialog = useDialog();

  return async (itemId: string) => {
    await dialog.open({
      title: '물품 상세',
      content: (close) => <DaisoItemDetailDialog itemId={itemId} close={close} />,
      fullScreen: true,
      slots: { transition: SlideUpTransition },
    });
  };
};
