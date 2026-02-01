import { BudgetingUnit } from '@/features/budgeting/types';
import { create } from 'zustand';

interface BudgetingConfigStates {
  inputUnit: BudgetingUnit;
  controlUnit: BudgetingUnit;
}

interface BudgetingConfigActions {
  setInputUnit: (inputUnit: BudgetingUnit) => void;
  setControlUnit: (controlUnit: BudgetingUnit) => void;
  reset: () => void;
}

type BudgetingConfigStore = BudgetingConfigStates & BudgetingConfigActions;

const initialStates: BudgetingConfigStates = {
  inputUnit: 1,
  controlUnit: 1,
};

export const useBudgetingConfigStore = create<BudgetingConfigStore>()((set) => ({
  ...initialStates,
  setInputUnit: (inputUnit) => set({ inputUnit }),
  setControlUnit: (controlUnit) => set({ controlUnit }),
  reset: () => set(initialStates),
}));
