import { BudgetingUnit } from '@/features/budgeting/types';

const EOK = 100_000_000;
const MAN = 10_000;

export const formatAmount = (amount: number) => {
  if (amount === 0) return '0원';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const eok = Math.floor(absAmount / EOK);
  const man = Math.floor((absAmount % EOK) / MAN);
  const won = absAmount % MAN;

  const eokPart = eok > 0 && `${eok}억`;
  const manPart = man > 0 && `${man}만`;
  const wonPart = won > 0 && `${won}`;

  const parts = [eokPart, manPart, wonPart].filter(Boolean);

  const result = `${parts.join(' ')}원`;
  return isNegative ? `-${result}` : result;
};

export const parseInputWithUnit = (input: number, unit: BudgetingUnit) => {
  return input * unit;
};
