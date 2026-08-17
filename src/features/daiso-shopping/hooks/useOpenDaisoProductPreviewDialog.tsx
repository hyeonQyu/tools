import { useDialog } from '@/dialog';
import { DaisoProductPreviewDialog } from '@/features/daiso-shopping/components/DaisoProductPreviewDialog';
import { DaisoProduct } from '@/features/daiso-shopping/types';

export const useOpenDaisoProductPreviewDialog = () => {
  const dialog = useDialog();

  return async (product: DaisoProduct) => {
    await dialog.open({
      title: '상품 미리보기',
      content: (close) => <DaisoProductPreviewDialog product={product} close={close} />,
      maxWidth: 'sm',
      fullWidth: true,
    });
  };
};
