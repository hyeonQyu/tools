import { FuelPaymentRecord } from '@/features/fuel-payment/data/repositories';
import { FIRST_MONTH, getKstDateParts, LAST_MONTH, toKstDateKey } from '@/lib';

export interface FuelPaymentYearMonth {
  year: number;
  month: number;
}

export type FuelPaymentMonthDirection = 'prev' | 'next';

export const getAdjacentFuelPaymentMonth = (
  { year, month }: FuelPaymentYearMonth,
  direction: FuelPaymentMonthDirection,
): FuelPaymentYearMonth => {
  if (direction === 'prev') {
    return month === FIRST_MONTH ? { year: year - 1, month: LAST_MONTH } : { year, month: month - 1 };
  }

  return month === LAST_MONTH ? { year: year + 1, month: FIRST_MONTH } : { year, month: month + 1 };
};

export const filterFuelPaymentRecordsByMonth = (records: FuelPaymentRecord[], target: FuelPaymentYearMonth): FuelPaymentRecord[] => {
  return records.filter((record) => {
    const parts = getKstDateParts(record.date);
    return parts.year === target.year && parts.month === target.month;
  });
};

export const getFuelPaymentRecordByDateKey = (records: FuelPaymentRecord[]): Map<string, FuelPaymentRecord> => {
  return new Map(records.map((record) => [toKstDateKey(record.date), record]));
};

export const calculateFuelLiters = (pricePerLiter?: number, totalAmount?: number): number | null => {
  return pricePerLiter && totalAmount ? totalAmount / pricePerLiter : null;
};
