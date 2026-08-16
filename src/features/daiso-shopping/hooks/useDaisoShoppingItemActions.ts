import { daisoShoppingService } from '@/features/daiso-shopping/data';
import { getDaisoShoppingItemsQueryOptions } from '@/features/daiso-shopping/queries';
import { DaisoProduct, DaisoShoppingItemEntity, DaisoShoppingItemPayload } from '@/features/daiso-shopping/types';
import { enqueueClosableSnackbar } from '@/styles';
import { useQueryClient } from '@tanstack/react-query';
import { useRefreshDaisoShoppingQuery } from './useRefreshDaisoShoppingQuery';

export const useDaisoShoppingItemActions = () => {
  const queryClient = useQueryClient();
  const refresh = useRefreshDaisoShoppingQuery();

  const { queryKey } = getDaisoShoppingItemsQueryOptions();

  const add = async (product: DaisoProduct) => {
    await daisoShoppingService.addProduct(product);
    await refresh();
  };

  const update = async (id: string, payload: Partial<DaisoShoppingItemPayload>) => {
    await daisoShoppingService.update(id, payload);
    await refresh();
  };

  const remove = async (id: string) => {
    await daisoShoppingService.delete(id);
    await refresh();
  };

  /** 체크는 즉시 반영하고 실패했을 때만 되돌린다. */
  const toggleDone = async (item: DaisoShoppingItemEntity) => {
    const done = !item.done;

    queryClient.setQueryData<DaisoShoppingItemEntity[]>(queryKey, (previous) =>
      previous?.map((entity) => (entity.id === item.id ? { ...entity, done } : entity)),
    );

    try {
      await daisoShoppingService.update(item.id, { done });
    } catch (error) {
      console.error(error);
      await refresh();
      enqueueClosableSnackbar({ message: '변경에 실패했습니다.', variant: 'error' });
    }
  };

  const clearDone = async () => {
    await daisoShoppingService.clearDone();
    await refresh();
    enqueueClosableSnackbar({ message: '담은 항목을 비웠습니다.', variant: 'success' });
  };

  return { add, update, remove, toggleDone, clearDone };
};
