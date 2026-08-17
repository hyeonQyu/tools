import { CgvAlertViewType } from '@/features/cgv-alert/types';
import { create } from 'zustand';

interface CgvAlertStates {
  currentView: CgvAlertViewType;
}

interface CgvAlertActions {
  setCurrentView: (currentView: CgvAlertViewType) => void;
  reset: (states?: Partial<CgvAlertStates>) => void;
}

type CgvAlertStore = CgvAlertStates & CgvAlertActions;

const initialStates: CgvAlertStates = {
  currentView: 'watches',
};

export const useCgvAlertStore = create<CgvAlertStore>()((set) => ({
  ...initialStates,

  setCurrentView: (currentView) => set({ currentView }),

  reset: (states) => set({ ...initialStates, ...states }),
}));
