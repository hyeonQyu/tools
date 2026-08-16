import { daisoShoppingService } from '@/features/daiso-shopping/data';
import { DaisoSavedStore, DaisoStoreStock } from '@/features/daiso-shopping/types';
import { enqueueClosableSnackbar } from '@/styles';
import { useRefreshDaisoShoppingQuery } from './useRefreshDaisoShoppingQuery';

export const useDaisoStoreActions = () => {
  const refresh = useRefreshDaisoShoppingQuery();

  /** 매장을 저장하면서 곧바로 선택 상태로 만든다. */
  const save = async (store: DaisoStoreStock | DaisoSavedStore) => {
    await daisoShoppingService.saveStore(store);
    await refresh();
    enqueueClosableSnackbar({ message: `${store.storeName}을(를) 선택했습니다.`, variant: 'success' });
  };

  const select = async (storeCode: string) => {
    await daisoShoppingService.selectStore(storeCode);
    await refresh();
  };

  const remove = async (storeCode: string) => {
    await daisoShoppingService.removeStore(storeCode);
    await refresh();
  };

  return { save, select, remove };
};
