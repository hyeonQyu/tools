import { create } from 'zustand';
import { getKstNow, toKstMidnightDate } from '@/lib';

interface GoalsTrackingDailyStates {
  date: Date;
}

interface GoalsTrackingDailyActions {
  setDate: (date: Date) => void;
  reset: (states?: Partial<GoalsTrackingDailyStates>) => void;
}

type GoalsTrackingDailyStore = GoalsTrackingDailyStates & GoalsTrackingDailyActions;

const getInitialStates = (): GoalsTrackingDailyStates => ({
  date: getKstNow(),
});

export const useGoalsTrackingDailyStore = create<GoalsTrackingDailyStore>((set) => ({
  ...getInitialStates(),
  setDate: (date) => set({ date: toKstMidnightDate(date) }),
  reset: (states) => set({ ...getInitialStates(), ...states }),
}));
