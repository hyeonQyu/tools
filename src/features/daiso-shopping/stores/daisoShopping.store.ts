import { DaisoShoppingItemEntity, DaisoShoppingSettingsPayload, DaisoShoppingSortType } from '@/features/daiso-shopping/types';
import { create } from 'zustand';

interface DaisoShoppingStates {
  items: DaisoShoppingItemEntity[];
  settings: DaisoShoppingSettingsPayload;
  sortBy: DaisoShoppingSortType;
}

interface DaisoShoppingActions {
  setSortBy: (sortBy: DaisoShoppingSortType) => void;
  reset: (states?: Partial<DaisoShoppingStates>) => void;
}

type DaisoShoppingStore = DaisoShoppingStates & DaisoShoppingActions;

const initialStates: DaisoShoppingStates = {
  items: [],
  settings: { stores: [], selectedStoreCode: null },
  sortBy: 'aisle',
};

export const useDaisoShoppingStore = create<DaisoShoppingStore>()((set) => ({
  ...initialStates,
  setSortBy: (sortBy) => set({ sortBy }),
  reset: (states) => set({ ...initialStates, ...states }),
}));
