import { getKstDateParts, getKstNow } from '@/lib';
import { create } from 'zustand';

interface FuelPaymentMonthlyStates {
  year: number;
  month: number;
}

interface FuelPaymentMonthlyActions {
  setYearMonth: (year: number, month: number) => void;
  jumpToCurrent: () => void;
  reset: (states?: Partial<FuelPaymentMonthlyStates>) => void;
}

type FuelPaymentMonthlyStore = FuelPaymentMonthlyStates & FuelPaymentMonthlyActions;

const getInitialStates = (): FuelPaymentMonthlyStates => {
  const { year, month } = getKstDateParts(getKstNow());
  return { year, month };
};

export const useFuelPaymentMonthlyStore = create<FuelPaymentMonthlyStore>((set) => ({
  ...getInitialStates(),
  setYearMonth: (year, month) => set({ year, month }),
  jumpToCurrent: () => set(getInitialStates()),
  reset: (states) => set({ ...getInitialStates(), ...states }),
}));
