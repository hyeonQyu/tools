import { AllocationType, BudgetItem } from '@/features/budgeting/types';
import { generateRandomKey } from '@/lib';
import { create } from 'zustand';

interface BudgetingStates {
  totalAmount: number;
  allocationType: AllocationType;
  items: BudgetItem[];
}

interface BudgetingActions {
  setTotalAmount: (amount: number) => void;
  setAllocationType: (type: AllocationType) => void;
  addItem: () => void;
  updateItem: (id: string, updates: Partial<BudgetItem>) => void;
  deleteItem: (id: string) => void;
  reorderItems: (items: BudgetItem[]) => void;
  reset: () => void;
}

type BudgetingStore = BudgetingStates & BudgetingActions;

const initialStates: BudgetingStates = {
  totalAmount: 0,
  allocationType: 'amount',
  items: [],
};

export const useBudgetingStore = create<BudgetingStore>()((set) => ({
  ...initialStates,
  setTotalAmount: (amount) => set({ totalAmount: amount }),
  setAllocationType: (type) => set({ allocationType: type }),
  addItem: () =>
    set((state) => ({
      items: [
        ...state.items,
        {
          id: generateRandomKey('budget-item'),
          name: '',
          value: 0,
          isAmountFixed: false,
        },
      ],
    })),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    })),
  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  reorderItems: (items) => set({ items }),
  reset: () => set(initialStates),
}));
