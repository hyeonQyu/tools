export type BudgetingUnit = 1 | 10000 | 100000;

export type AllocationType = 'percentage' | 'amount';

export interface BudgetItem {
  id: string;
  name: string;
  value: number;
  isAmountFixed: boolean;
}
