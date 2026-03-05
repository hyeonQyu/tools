import { create } from 'zustand';

interface GoalsTrackingDailyStates {
  date: Date;
}

interface GoalsTrackingDailyActions {
  setDate: (date: Date) => void;
  reset: (states?: Partial<GoalsTrackingDailyStates>) => void;
}

type GoalsTrackingDailyStore = GoalsTrackingDailyStates & GoalsTrackingDailyActions;

const initialStates: GoalsTrackingDailyStates = {
  date: new Date(),
};

export const useGoalsTrackingDailyStore = create<GoalsTrackingDailyStore>((set) => ({
  ...initialStates,
  setDate: (date) => set({ date }),
  reset: (states) => set({ ...initialStates, ...states }),
}));
