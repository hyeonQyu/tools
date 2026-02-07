import { BudgetingUnit } from '@/features/budgeting/types';
import { create } from 'zustand';

export interface BudgetingConfigStates {
  inputUnit: BudgetingUnit;
  controlUnit: BudgetingUnit;
}

interface BudgetingConfigActions {
  setInputUnit: (inputUnit: BudgetingUnit) => void;
  setControlUnit: (controlUnit: BudgetingUnit) => void;
  reset: (states?: Partial<BudgetingConfigStates>) => void;
  getState: () => BudgetingConfigStates;
}

type BudgetingConfigStore = BudgetingConfigStates & BudgetingConfigActions;

const initialStates: BudgetingConfigStates = {
  inputUnit: 1,
  controlUnit: 1,
};

export const useBudgetingConfigStore = create<BudgetingConfigStore>()((set, get) => ({
  ...initialStates,
  setInputUnit: (inputUnit) => set({ inputUnit }),
  setControlUnit: (controlUnit) => set({ controlUnit }),
  reset: (states) => set({ ...initialStates, ...states }),
  getState: () => ({
    inputUnit: get().inputUnit,
    controlUnit: get().controlUnit,
  }),
}));
