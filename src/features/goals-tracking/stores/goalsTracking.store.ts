import { GoalsTrackerViewType } from '@/features/goals-tracking/types';
import { create } from 'zustand';

export interface GoalsTrackingStates {
  currentView: GoalsTrackerViewType;
}

interface GoalsTrackingActions {
  setCurrentView: (view: GoalsTrackerViewType) => void;
  reset: (states?: Partial<GoalsTrackingStates>) => void;
}

type GoalsTrackingStore = GoalsTrackingStates & GoalsTrackingActions;

const initialStates: GoalsTrackingStates = {
  currentView: 'daily',
};

export const useGoalsTrackingStore = create<GoalsTrackingStore>()((set) => ({
  ...initialStates,
  setCurrentView: (view) => set({ currentView: view }),
  reset: (states) => set({ ...initialStates, ...states }),
}));
