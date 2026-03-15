import { FuelPaymentViewType } from '@/features/fuel-payment/types';
import { create } from 'zustand';

export interface FuelPaymentStates {
  currentView: FuelPaymentViewType;
}

interface FuelPaymentActions {
  setCurrentView: (view: FuelPaymentViewType) => void;
  reset: (states?: Partial<FuelPaymentStates>) => void;
}

type FuelPaymentStore = FuelPaymentStates & FuelPaymentActions;

const initialStates: FuelPaymentStates = {
  currentView: 'records',
};

export const useFuelPaymentStore = create<FuelPaymentStore>()((set) => ({
  ...initialStates,
  setCurrentView: (view) => set({ currentView: view }),
  reset: (states) => set({ ...initialStates, ...states }),
}));
