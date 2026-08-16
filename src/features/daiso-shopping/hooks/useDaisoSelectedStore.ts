import { useDaisoShoppingStore } from '@/features/daiso-shopping/stores';
import { DaisoSavedStore } from '@/features/daiso-shopping/types';

/** 선택한 매장. 선택값이 없으면 저장된 첫 매장으로 대체한다. */
export const useDaisoSelectedStore = (): DaisoSavedStore | null => {
  const settings = useDaisoShoppingStore((s) => s.settings);

  const selected = settings.stores.find((store) => store.storeCode === settings.selectedStoreCode);
  return selected ?? settings.stores[0] ?? null;
};
