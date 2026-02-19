import { AllocationType, BudgetingItem } from '@/features/budgeting/types';
import { generateRandomKey } from '@/lib';
import { create } from 'zustand';

export interface BudgetingStates {
  totalAmount: number;
  allocationType: AllocationType;
  items: BudgetingItem[];
}

interface BudgetingActions {
  setTotalAmount: (amount: number) => void;
  setAllocationType: (type: AllocationType) => void;
  addItem: () => void;
  updateItem: (id: string, updates: Partial<BudgetingItem>) => void;
  deleteItem: (id: string) => void;
  reorderItems: (items: BudgetingItem[]) => void;
  reset: (states?: Partial<BudgetingStates>) => void;
  getState: () => BudgetingStates;
}

type BudgetingStore = BudgetingStates & BudgetingActions;

const initialStates: BudgetingStates = {
  totalAmount: 0,
  allocationType: 'amount',
  items: [],
};

export const useBudgetingStore = create<BudgetingStore>()((set, get) => ({
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
  reset: (states) => set({ ...initialStates, ...states }),
  getState: () => ({
    totalAmount: get().totalAmount,
    allocationType: get().allocationType,
    items: get().items,
  }),
}));
