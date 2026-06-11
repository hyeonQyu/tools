import { BelongingGroupByType, BelongingItemEntity, BelongingSettingsPayload } from '@/features/belongings/types';
import { create } from 'zustand';

interface BelongingStates {
  items: BelongingItemEntity[];
  settings: BelongingSettingsPayload;
  groupBy: BelongingGroupByType;
}

interface BelongingActions {
  setGroupBy: (groupBy: BelongingGroupByType) => void;
  reset: (states?: Partial<BelongingStates>) => void;
}

type BelongingStore = BelongingStates & BelongingActions;

const initialStates: BelongingStates = {
  items: [],
  settings: { locations: [], tags: [] },
  groupBy: 'location',
};

export const useBelongingStore = create<BelongingStore>()((set) => ({
  ...initialStates,
  setGroupBy: (groupBy) => set({ groupBy }),
  reset: (states) => set({ ...initialStates, ...states }),
}));
