import { useDialog } from '@/dialog';
import { ExpirationDateDayItemsDialog } from '@/features/expiration-dates/components/ExpirationDateDayItemsDialog';
import { ExpirationDateItemEntity } from '@/features/expiration-dates/types';
import { useOpenExpirationDateItemDialog } from './useOpenExpirationDateItemDialog';

export const useOpenExpirationDateDayItemsDialog = () => {
  const dialog = useDialog();
  const { openAdd, openEdit } = useOpenExpirationDateItemDialog();

  return async (date: Date, items: ExpirationDateItemEntity[]) => {
    if (items.length === 0) {
      await openAdd(date);
      return;
    }

    await dialog.open({
      title: '만료 물품',
      content: (close) => (
        <ExpirationDateDayItemsDialog
          close={close}
          date={date}
          items={items}
          onItemClick={(item) => openEdit(item)}
          onAdd={async () => {
            close();
            await openAdd(date);
          }}
        />
      ),
    });
  };
};
