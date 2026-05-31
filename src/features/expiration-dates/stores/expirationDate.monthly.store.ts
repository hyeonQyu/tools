import { getKstDateParts, getKstNow } from '@/lib';
import { create } from 'zustand';

interface ExpirationDateMonthlyStates {
  year: number;
  month: number;
}

interface ExpirationDateMonthlyActions {
  setYearMonth: (year: number, month: number) => void;
  jumpToCurrent: () => void;
  reset: (states?: Partial<ExpirationDateMonthlyStates>) => void;
}

type ExpirationDateMonthlyStore = ExpirationDateMonthlyStates & ExpirationDateMonthlyActions;

const getInitialStates = (): ExpirationDateMonthlyStates => {
  const { year, month } = getKstDateParts(getKstNow());
  return { year, month };
};

export const useExpirationDateMonthlyStore = create<ExpirationDateMonthlyStore>((set) => ({
  ...getInitialStates(),
  setYearMonth: (year, month) => set({ year, month }),
  jumpToCurrent: () => set(getInitialStates()),
  reset: (states) => set({ ...getInitialStates(), ...states }),
}));
