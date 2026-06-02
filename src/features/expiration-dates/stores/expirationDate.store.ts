import { ExpirationDateGroupByType, ExpirationDateItemEntity, ExpirationDateViewType } from '@/features/expiration-dates/types';
import { create } from 'zustand';

interface ExpirationDateStates {
  items: ExpirationDateItemEntity[];
  settings: { locations: string[]; tags: string[] };
  currentView: ExpirationDateViewType;
  groupBy: ExpirationDateGroupByType;
}

interface ExpirationDateActions {
  setCurrentView: (view: ExpirationDateViewType) => void;
  setGroupBy: (groupBy: ExpirationDateGroupByType) => void;
  reset: (states?: Partial<ExpirationDateStates>) => void;
}

type ExpirationDateStore = ExpirationDateStates & ExpirationDateActions;

const initialStates: ExpirationDateStates = {
  items: [],
  settings: { locations: [], tags: [] },
  currentView: 'calendar',
  groupBy: 'location',
};

export const useExpirationDateStore = create<ExpirationDateStore>()((set) => ({
  ...initialStates,
  setCurrentView: (currentView) => set({ currentView }),
  setGroupBy: (groupBy) => set({ groupBy }),
  reset: (states) => set({ ...initialStates, ...states }),
}));
