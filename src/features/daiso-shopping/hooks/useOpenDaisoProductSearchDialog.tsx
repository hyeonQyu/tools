import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import { DaisoProductSearchDialog } from '@/features/daiso-shopping/components/DaisoProductSearchDialog';

export const useOpenDaisoProductSearchDialog = () => {
  const dialog = useDialog();

  return async () => {
    await dialog.open({
      title: '상품 검색',
      content: (close) => <DaisoProductSearchDialog close={close} />,
      fullScreen: true,
      slots: { transition: SlideUpTransition },
    });
  };
};
