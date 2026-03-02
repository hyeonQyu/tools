import { getKstNow } from '@/lib';
import { create } from 'zustand';

interface GoalsTrackingYearStates {
  year: number;
}

interface GoalsTrackingYearActions {
  setYear: (year: number) => void;
  reset: (states?: Partial<GoalsTrackingYearStates>) => void;
}

type GoalsTrackingYearStore = GoalsTrackingYearStates & GoalsTrackingYearActions;

const getInitialStates = (): GoalsTrackingYearStates => ({
  year: getKstNow().getFullYear(),
});

export const useGoalsTrackingYearStore = create<GoalsTrackingYearStore>((set) => ({
  ...getInitialStates(),
  setYear: (year) => set({ year }),
  reset: (states) => set({ ...getInitialStates(), ...states }),
}));
